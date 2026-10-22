// Sign in / sign up with Google (Google Identity Services ID tokens).
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const { pool } = require('../db');
const { SESSION_COOKIE, hashPassword, createSession, sessionCookieOptions } = require('../lib/auth');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const client = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
// Version of the terms / data policy shown in the frontend (LegalPage.jsx LEGAL.version)
const TERMS_VERSION = '2026-10-22';
const AREAS = ['tech', 'engineering', 'business', 'health', 'education', 'sales', 'finance', 'design', 'legal', 'construction', 'logistics', 'service', 'general'];

// Verified Google profiles waiting for the user to complete the sign-up form.
// Kept server-side so the client cannot tamper with the email or Google id.
const PENDING_TTL_MS = 15 * 60 * 1000;
const pending = new Map();

function prunePending() {
  const now = Date.now();
  for (const [k, v] of pending) if (v.expires < now) pending.delete(k);
}

async function startSession(res, user) {
  const { token, expiresAt } = await createSession(user.id);
  res.cookie(SESSION_COOKIE, token, { ...sessionCookieOptions(), expires: expiresAt });
  return { id: user.id, username: user.username, role: user.role, google: true };
}

function config(req, res) {
  res.json({ googleClientId: GOOGLE_CLIENT_ID || null });
}

async function googleLogin(req, res) {
  if (!client) return res.status(503).json({ error: 'El inicio de sesión con Google no está configurado' });
  const credential = req.body?.credential;
  if (typeof credential !== 'string') return res.status(400).json({ error: 'Falta la credencial de Google' });

  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch (_) {
    return res.status(401).json({ error: 'No se pudo verificar la cuenta de Google' });
  }
  if (!payload?.email || !payload.email_verified) {
    return res.status(401).json({ error: 'El correo de Google no está verificado' });
  }

  try {
    let { rows } = await pool.query('SELECT id, username, role FROM users WHERE google_sub = $1', [payload.sub]);
    if (!rows.length) {
      // Existing account with the same email: link it to Google instead of duplicating it
      ({ rows } = await pool.query(
        `UPDATE users SET google_sub = $1, updated_at = NOW()
         WHERE lower(email) = lower($2) AND google_sub IS NULL
         RETURNING id, username, role`,
        [payload.sub, payload.email]
      ));
    }
    if (rows.length) return res.json({ user: await startSession(res, rows[0]) });

    prunePending();
    const registrationToken = crypto.randomBytes(24).toString('base64url');
    const profile = { sub: payload.sub, email: payload.email, name: payload.name || '', picture: payload.picture || '' };
    pending.set(registrationToken, { profile, expires: Date.now() + PENDING_TTL_MS });
    res.json({
      needsRegistration: true,
      registrationToken,
      profile: { email: profile.email, name: profile.name, picture: profile.picture },
    });
  } catch (err) {
    console.error('[google]', err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function uniqueUsername(email) {
  const base = (email.split('@')[0] || 'usuario').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 40).padEnd(3, '0');
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? base : `${base}${i + 1}`;
    const { rows } = await pool.query('SELECT 1 FROM users WHERE username = $1', [candidate]);
    if (!rows.length) return candidate;
  }
  return `${base}-${crypto.randomBytes(3).toString('hex')}`;
}

async function uniqueSlug(base) {
  const slug = base.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'mi-cv';
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? slug : `${slug}-${i + 1}`;
    const { rows } = await pool.query('SELECT 1 FROM cv_profiles WHERE profile_name = $1', [candidate]);
    if (!rows.length) return candidate;
  }
  return `${slug}-${crypto.randomBytes(3).toString('hex')}`;
}

// Saves the Google profile photo locally (bigger size) so PDFs do not depend on Google URLs
async function downloadAvatar(url) {
  if (!/^https:\/\/[a-z0-9.-]+\.googleusercontent\.com\//.test(url || '')) return null;
  try {
    const res = await fetch(url.replace(/=s\d+(-c)?$/, '=s400-c'));
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.startsWith('image/')) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 5 * 1024 * 1024) return null;
    const ext = type.includes('png') ? '.png' : '.jpg';
    const filename = `profile_${Date.now()}_${crypto.randomBytes(3).toString('hex')}${ext}`;
    await fs.promises.writeFile(path.join(UPLOADS_DIR, filename), buf);
    return `/uploads/${filename}`;
  } catch (err) {
    console.warn('[google] avatar download failed:', err.message);
    return null;
  }
}

const clean = (v, max) => String(v || '').trim().slice(0, max);

async function googleRegister(req, res) {
  prunePending();
  const { registrationToken } = req.body || {};
  const entry = pending.get(registrationToken);
  if (!entry) return res.status(400).json({ error: 'El registro expiró. Vuelve a continuar con Google.' });

  const { profile } = entry;
  const name = clean(req.body.name, 150) || profile.name;
  const title = clean(req.body.title, 200);
  const phone = clean(req.body.phone, 40);
  const location = clean(req.body.location, 120);
  const area = AREAS.includes(req.body.area) ? req.body.area : 'general';
  if (!name) return res.status(400).json({ error: 'Escribe tu nombre' });
  if (req.body.acceptTerms !== true) {
    return res.status(400).json({ error: 'Debes aceptar los Términos y la Política de Tratamiento de Datos' });
  }

  const db = await pool.connect();
  try {
    const exists = await db.query(
      'SELECT 1 FROM users WHERE google_sub = $1 OR lower(email) = lower($2)',
      [profile.sub, profile.email]
    );
    if (exists.rows.length) {
      pending.delete(registrationToken);
      return res.status(409).json({ error: 'Esta cuenta ya está registrada. Continúa con Google para entrar.' });
    }

    const username = await uniqueUsername(profile.email);
    const slug = await uniqueSlug(`cv-${username}`);
    const avatar = await downloadAvatar(profile.picture);
    const personalInfo = { name, title, email: profile.email, phone, location, area };

    await db.query('BEGIN');
    const userRes = await db.query(
      `INSERT INTO users (username, password_hash, role, email, google_sub, full_name, terms_accepted_at, terms_version)
       VALUES ($1, $2, 'editor', $3, $4, $5, NOW(), $6) RETURNING id, username, role`,
      // Random password: Google accounts sign in with Google only
      [username, await hashPassword(crypto.randomBytes(32).toString('hex')), profile.email, profile.sub, name, TERMS_VERSION]
    );
    const user = userRes.rows[0];
    await db.query(
      `INSERT INTO cv_profiles (profile_name, profile_label, language, personal_info, profile_image, owner_id)
       VALUES ($1, $2, 'es', $3::jsonb, $4, $5), ($1, $2, 'en', $3::jsonb, $4, $5)`,
      [slug, title || name, JSON.stringify(personalInfo), avatar, user.id]
    );
    await db.query('COMMIT');
    pending.delete(registrationToken);

    res.status(201).json({ user: await startSession(res, user), profileName: slug });
  } catch (err) {
    await db.query('ROLLBACK').catch(() => {});
    console.error('[google register]', err);
    res.status(500).json({ error: 'No se pudo completar el registro' });
  } finally {
    db.release();
  }
}

module.exports = { config, googleLogin, googleRegister };
