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

module.exports = { requireAuth, requireAdmin };
