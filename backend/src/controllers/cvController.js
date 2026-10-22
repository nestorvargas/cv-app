const { pool } = require('../db');

async function listProfiles(req, res) {
  const isAdmin = req.user.role === 'admin';
  try {
    // Admins see every CV (with its owner); other users only their own.
    // `progress` carries the fields the list needs to show completeness per language.
    const result = await pool.query(
      `SELECT DISTINCT ON (p.profile_name) p.profile_name, p.profile_label, p.personal_info, p.language,
              p.owner_id, u.username AS owner_username,
              json_build_object(
                'es', json_build_object('personal_info', p.personal_info, 'summary', p.summary, 'experience', p.experience,
                                        'education', p.education, 'skills', p.skills, 'certificates', p.certificates,
                                        'profile_image', p.profile_image),
                'en', CASE WHEN en.id IS NULL THEN NULL ELSE
                      json_build_object('personal_info', en.personal_info, 'summary', en.summary, 'experience', en.experience,
                                        'education', en.education, 'skills', en.skills, 'certificates', en.certificates,
                                        'profile_image', en.profile_image) END
              ) AS progress
       FROM cv_profiles p
       LEFT JOIN users u ON u.id = p.owner_id
       LEFT JOIN cv_profiles en ON en.profile_name = p.profile_name AND en.language = 'en'
       WHERE p.language = 'es' AND ($1 OR p.owner_id = $2)
       ORDER BY p.profile_name ASC`,
      [isAdmin, req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function getCv(req, res) {
  const { profileName, lang } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM cv_profiles WHERE profile_name = $1 AND language = $2',
      [profileName, lang]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CV not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function updateCv(req, res) {
  const { profileName, lang } = req.params;
  const { personal_info, summary, experience, education, skills, certificates, profile_image, profile_label, personal_references } = req.body;
  try {
    const result = await pool.query(
      `UPDATE cv_profiles SET
        personal_info = COALESCE($1::jsonb, personal_info),
        summary = COALESCE($2, summary),
        experience = COALESCE($3::jsonb, experience),
        education = COALESCE($4::jsonb, education),
        skills = COALESCE($5::jsonb, skills),
        certificates = COALESCE($6::jsonb, certificates),
        profile_image = COALESCE($7, profile_image),
        profile_label = COALESCE($8, profile_label),
        personal_references = COALESCE($11::jsonb, personal_references),
        updated_at = NOW()
      WHERE profile_name = $9 AND language = $10
      RETURNING *`,
      [
        personal_info ? JSON.stringify(personal_info) : null,
        summary || null,
        experience ? JSON.stringify(experience) : null,
        education ? JSON.stringify(education) : null,
        skills ? JSON.stringify(skills) : null,
        certificates ? JSON.stringify(certificates) : null,
        profile_image || null,
        profile_label || null,
        profileName,
        lang,
        personal_references ? JSON.stringify(personal_references) : null,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CV not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function createProfile(req, res) {
  const { profile_name, profile_label } = req.body;
  if (!profile_name || !profile_label) {
    return res.status(400).json({ error: 'profile_name and profile_label are required' });
  }
  const slug = profile_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const basePersonal = { name: 'Nombre Apellido', title: profile_label, phone: '', email: '', location: '' };
  try {
    await pool.query(
      `INSERT INTO cv_profiles (language, profile_name, profile_label, personal_info, summary, experience, education, skills, certificates, owner_id)
       VALUES ($1, $2, $3, $4::jsonb, $5, '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, '[]'::jsonb, $7),
              ($6, $2, $3, $4::jsonb, $5, '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, '[]'::jsonb, $7)`,
      ['es', slug, profile_label, JSON.stringify(basePersonal), '', 'en', req.user.id]
    );
    res.json({ profile_name: slug, profile_label });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A profile with that name already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function deleteProfile(req, res) {
  const { profileName } = req.params;
  if (['desarrollador', 'devops-linux', 'lider-tecnico'].includes(profileName)) {
    return res.status(403).json({ error: 'Cannot delete a default profile' });
  }
  try {
    await pool.query('DELETE FROM cv_profiles WHERE profile_name = $1', [profileName]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// Admin only: assign a CV (both languages) to a user, or null to leave it admin-only
async function setProfileOwner(req, res) {
  const { profileName } = req.params;
  const { ownerId } = req.body || {};
  if (ownerId !== null && !Number.isInteger(ownerId)) {
    return res.status(400).json({ error: 'ownerId must be a user id or null' });
  }
  try {
    if (ownerId !== null) {
      const user = await pool.query('SELECT 1 FROM users WHERE id = $1', [ownerId]);
      if (user.rows.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    const result = await pool.query(
      'UPDATE cv_profiles SET owner_id = $1, updated_at = NOW() WHERE profile_name = $2',
      [ownerId, profileName]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'CV not found' });
    res.json({ profile_name: profileName, owner_id: ownerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// Copies both language versions of a CV into a new profile owned by the current user
async function cloneProfile(req, res) {
  const { profileName } = req.params;
  const label = String(req.body?.profile_label || '').trim().slice(0, 200);
  if (!label) return res.status(400).json({ error: 'Escribe un nombre para la copia' });

  const base = label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'copia';
  try {
    let slug = base;
    for (let i = 2; ; i++) {
      const { rows } = await pool.query('SELECT 1 FROM cv_profiles WHERE profile_name = $1', [slug]);
      if (!rows.length) break;
      slug = `${base}-${i}`;
    }
    const result = await pool.query(
      `INSERT INTO cv_profiles (profile_name, profile_label, language, personal_info, summary, experience, education,
                                skills, certificates, personal_references, profile_image, owner_id)
       SELECT $1, $2, language, personal_info, summary, experience, education,
              skills, certificates, personal_references, profile_image, $3
       FROM cv_profiles WHERE profile_name = $4`,
      [slug, label, req.user.id, profileName]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'CV not found' });
    res.status(201).json({ profile_name: slug, profile_label: label });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

module.exports = { listProfiles, getCv, updateCv, createProfile, deleteProfile, setProfileOwner, cloneProfile };
