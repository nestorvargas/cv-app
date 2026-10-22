const { pool } = require('../db');
const { hashPassword, validateCredentials } = require('../lib/auth');

const ROLES = ['admin', 'editor'];

async function countAdmins(client = pool) {
  const { rows } = await client.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin'");
  return rows[0].count;
}

async function listUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, username, role, created_at, updated_at FROM users ORDER BY username ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function createUser(req, res) {
  const { username, password, role = 'editor' } = req.body || {};
  const error = validateCredentials(username, password);
  if (error) return res.status(400).json({ error });
  if (!ROLES.includes(role)) return res.status(400).json({ error: 'Rol inválido' });
  try {
    const result = await pool.query(
      `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)
       RETURNING id, username, role, created_at, updated_at`,
      [username, await hashPassword(password), role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Ese usuario ya existe' });
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function updateUser(req, res) {
  const id = Number(req.params.id);
  const { password, role } = req.body || {};
  if (password !== undefined) {
    const error = validateCredentials(undefined, password);
    if (error) return res.status(400).json({ error });
  }
  if (role !== undefined && !ROLES.includes(role)) return res.status(400).json({ error: 'Rol inválido' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await client.query('SELECT role FROM users WHERE id = $1 FOR UPDATE', [id]);
    if (current.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (role === 'editor' && current.rows[0].role === 'admin' && (await countAdmins(client)) <= 1) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Debe existir al menos un admin' });
    }
    const result = await client.query(
      `UPDATE users SET
        password_hash = COALESCE($1, password_hash),
        role = COALESCE($2, role),
        updated_at = NOW()
       WHERE id = $3
       RETURNING id, username, role, created_at, updated_at`,
      [password !== undefined ? await hashPassword(password) : null, role ?? null, id]
    );
    // A password reset by an admin signs the user out everywhere.
    if (password !== undefined) {
      await client.query('DELETE FROM sessions WHERE user_id = $1', [id]);
    }
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
}

async function deleteUser(req, res) {
  const id = Number(req.params.id);
  if (id === req.user.id) return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await client.query('SELECT role FROM users WHERE id = $1 FOR UPDATE', [id]);
    if (current.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (current.rows[0].role === 'admin' && (await countAdmins(client)) <= 1) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Debe existir al menos un admin' });
    }
    await client.query('DELETE FROM users WHERE id = $1', [id]);
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
}

module.exports = { listUsers, createUser, updateUser, deleteUser };
