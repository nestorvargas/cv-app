const { pool } = require('../db');

const AREAS = ['tech', 'engineering', 'business', 'health', 'education', 'sales', 'finance', 'design', 'legal', 'construction', 'logistics', 'service', 'general'];

// Search job titles in the CV language; titles of the CV's area come first.
async function searchTitles(req, res) {
  const q = String(req.query.q || '').trim().slice(0, 80);
  const lang = req.query.lang === 'en' ? 'en' : 'es';
  const area = AREAS.includes(req.query.area) ? req.query.area : null;
  const col = lang === 'en' ? 'title_en' : 'title_es';
  try {
    const result = await pool.query(
      `SELECT id, area, ${col} AS title
       FROM job_titles
       WHERE $1 = '' OR ${col} ILIKE '%' || $1 || '%' OR title_es ILIKE '%' || $1 || '%' OR title_en ILIKE '%' || $1 || '%'
       ORDER BY (area = $2) DESC, (${col} ILIKE $1 || '%') DESC, ${col} ASC
       LIMIT 10`,
      [q, area]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// Admin only: add a title to the catalog
async function addTitle(req, res) {
  const title_es = String(req.body?.title_es || '').trim();
  const title_en = String(req.body?.title_en || '').trim() || title_es;
  const area = AREAS.includes(req.body?.area) ? req.body.area : 'general';
  if (title_es.length < 3 || title_es.length > 150 || title_en.length > 150) {
    return res.status(400).json({ error: 'El título debe tener entre 3 y 150 caracteres' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO job_titles (area, title_es, title_en, created_by) VALUES ($1, $2, $3, $4)
       RETURNING id, area, title_es, title_en`,
      [area, title_es, title_en, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Ese título ya está en la base' });
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

module.exports = { searchTitles, addTitle };
