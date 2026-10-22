const crypto = require('crypto');
const { promisify } = require('util');
const { pool } = require('../db');

const scrypt = promisify(crypto.scrypt);

const SESSION_COOKIE = 'cv_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 8;

// Stored format: scrypt$<salt hex>$<hash hex>
async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  const [scheme, saltHex, hashHex] = (stored || '').split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Only the token hash is stored, so a DB leak does not expose live sessions.
async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await pool.query(
    'INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)',
    [hashToken(token), userId, expiresAt]
  );
  return { token, expiresAt };
}

async function findSessionUser(token) {
  if (!token) return null;
  const result = await pool.query(
    `SELECT u.id, u.username, u.role, (u.google_sub IS NOT NULL) AS google
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
    [hashToken(token)]
  );
  return result.rows[0] || null;
}

async function deleteSession(token) {
  if (!token) return;
  await pool.query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)]);
}

function parseCookies(header) {
  const cookies = {};
  (header || '').split(';').forEach(part => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const name = part.slice(0, idx).trim();
    try {
      cookies[name] = decodeURIComponent(part.slice(idx + 1).trim());
    } catch (_) {}
  });
  return cookies;
}

function getSessionToken(req) {
  return parseCookies(req.headers.cookie)[SESSION_COOKIE] || null;
}

// COOKIE_SECURE=true in production (served over HTTPS behind the tunnel/proxy).
function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    path: '/',
  };
}

function validateCredentials(username, password, { requirePassword = true } = {}) {
  if (username !== undefined && !/^[a-zA-Z0-9._-]{3,50}$/.test(username || '')) {
    return 'El usuario debe tener 3-50 caracteres (letras, números, . _ -)';
  }
  if ((requirePassword || password !== undefined) && (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH)) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
  }
  return null;
}

// Seeds the first admin from env vars when the users table is empty.
async function ensureAdminUser() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM users');
  if (rows[0].count > 0) return;
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    console.warn('No users exist. Set ADMIN_USERNAME and ADMIN_PASSWORD to create the first admin.');
    return;
  }
  const error = validateCredentials(username, password);
  if (error) {
    console.warn(`Initial admin not created: ${error}`);
    return;
  }
  await pool.query(
    "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, 'admin')",
    [username, await hashPassword(password)]
  );
  console.log(`Initial admin user "${username}" created`);
}

module.exports = {
  SESSION_COOKIE,
  hashPassword,
  verifyPassword,
  hashToken,
  createSession,
  findSessionUser,
  deleteSession,
  getSessionToken,
  sessionCookieOptions,
  validateCredentials,
  ensureAdminUser,
};
