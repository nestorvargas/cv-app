const { pool } = require('../db');

async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  try {
    // Update both language versions with the same image
    await pool.query(
      `UPDATE cv_profiles SET profile_image = $1, updated_at = NOW()`,
      [imageUrl]
    );
    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save image path' });
  }
}

module.exports = { uploadImage };
