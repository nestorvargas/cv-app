const { pool } = require('../db');
const {
  SESSION_COOKIE,
  hashPassword,
  verifyPassword,
  createSession,
  deleteSession,
  getSessionToken,
  sessionCookieOptions,
  validateCredentials,
  hashToken,
} = require('../lib/auth');

// In-memory brute-force guard: max failed logins per IP within the window.
const MAX_FAILED = 10;
const WINDOW_MS = 15 * 60 * 1000;
const failedLogins = new Map();

function isLocked(ip) {
  const entry = failedLogins.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    failedLogins.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILED;
}

function registerFailure(ip) {
  const entry = failedLogins.get(ip);
  if (!entry || Date.now() - entry.first > WINDOW_MS) {
    failedLogins.set(ip, { count: 1, first: Date.now() });
  } else {
    entry.count += 1;
  }
}

async function login(req, res) {
  const { username, password } = req.body || {};
  if (isLocked(req.ip)) {
    return res.status(429).json({ error: 'Demasiados intentos. Intenta de nuevo en unos minutos.' });
  }
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }
  try {
    const result = await pool.query(
      'SELECT id, username, role, password_hash FROM users WHERE username = $1',
      [username.trim()]
    );
    const user = result.rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      registerFailure(req.ip);
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    failedLogins.delete(req.ip);
    await pool.query('DELETE FROM sessions WHERE expires_at <= NOW()');
    const { token, expiresAt } = await createSession(user.id);
    res.cookie(SESSION_COOKIE, token, { ...sessionCookieOptions(), expires: expiresAt });
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error' });
  }
}

async function logout(req, res) {
  try {
    await deleteSession(getSessionToken(req));
  } catch (err) {
    console.error(err);
  }
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions());
  res.json({ ok: true });
}

function me(req, res) {
  res.json(req.user);
}

async function changeOwnPassword(req, res) {
  const { currentPassword, newPassword } = req.body || {};
  const error = validateCredentials(undefined, newPassword);
  if (error) return res.status(400).json({ error });
  try {
    const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (!(await verifyPassword(currentPassword || '', result.rows[0]?.password_hash))) {
      return res.status(400).json({ error: 'La contraseña actual no es correcta' });
    }
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [await hashPassword(newPassword), req.user.id]
    );
    // Sign out other devices; keep the current session.
    await pool.query(
      'DELETE FROM sessions WHERE user_id = $1 AND token_hash <> $2',
      [req.user.id, hashToken(req.sessionToken)]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

module.exports = { login, logout, me, changeOwnPassword };
