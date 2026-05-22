const { pool } = require('../db');

async function getCv(req, res) {
  const { lang } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM cv_profiles WHERE language = $1',
      [lang]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CV not found for this language' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function updateCv(req, res) {
  const { lang } = req.params;
  const { personal_info, summary, experience, education, skills, profile_image } = req.body;
  try {
    const result = await pool.query(
      `UPDATE cv_profiles SET
        personal_info = COALESCE($1::jsonb, personal_info),
        summary = COALESCE($2, summary),
        experience = COALESCE($3::jsonb, experience),
        education = COALESCE($4::jsonb, education),
        skills = COALESCE($5::jsonb, skills),
        profile_image = COALESCE($6, profile_image),
        updated_at = NOW()
      WHERE language = $7
      RETURNING *`,
      [
        personal_info ? JSON.stringify(personal_info) : null,
        summary || null,
        experience ? JSON.stringify(experience) : null,
        education ? JSON.stringify(education) : null,
        skills ? JSON.stringify(skills) : null,
        profile_image || null,
        lang,
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

module.exports = { getCv, updateCv };
