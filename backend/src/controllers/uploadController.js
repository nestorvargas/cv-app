const { pool } = require('../db');

async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const { profileName } = req.query;
  if (!profileName) {
    return res.status(400).json({ error: 'profileName is required' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  // Signatures are stored in personal_info by the editor's normal save
  if (req.query.kind === 'signature') return res.json({ url: imageUrl });
  try {
    await pool.query(
      `UPDATE cv_profiles SET profile_image = $1, updated_at = NOW() WHERE profile_name = $2`,
      [imageUrl, profileName]
    );
    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save image path' });
  }
}

module.exports = { uploadImage };
