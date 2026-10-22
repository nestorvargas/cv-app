const { pool } = require('../db');
const { findSessionUser, getSessionToken } = require('../lib/auth');

async function requireAuth(req, res, next) {
  try {
    const token = getSessionToken(req);
    const user = await findSessionUser(token);
    if (!user) return res.status(401).json({ error: 'No autenticado' });
    req.user = user;
    req.sessionToken = token;
    next();
  } catch (err) {
    console.error('[auth]', err);
    res.status(500).json({ error: 'Auth error' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Requiere rol admin' });
  next();
}

// Admins can access every CV; other users only the ones they own.
// Answers 404 (not 403) so CVs of other users are not revealed.
function requireProfileAccess(getProfileName) {
  return async (req, res, next) => {
    if (req.user.role === 'admin') return next();
    try {
      const { rows } = await pool.query(
        'SELECT 1 FROM cv_profiles WHERE profile_name = $1 AND owner_id = $2 LIMIT 1',
        [getProfileName(req), req.user.id]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'CV not found' });
      next();
    } catch (err) {
      console.error('[auth]', err);
      res.status(500).json({ error: 'Auth error' });
    }
  };
}

module.exports = { requireAuth, requireAdmin, requireProfileAccess };
