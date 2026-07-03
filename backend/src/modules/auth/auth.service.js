const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

const register = async (name, email, password, role = 'customer') => {
  if (!name || !email || !password) {
    const err = new Error('name, email và password là bắt buộc');
    err.status = 400;
    throw err;
  }

  // Kiểm tra email đã tồn tại
  const { rows: existing } = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    const err = new Error('Email đã được sử dụng');
    err.status = 409;
    throw err;
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { rows: result } = await db.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, password_hash, role]
  );

  const { rows: user } = await db.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [result.insertId]
  );
  return user[0];
};

const login = async (email, password) => {
  if (!email || !password) {
    const err = new Error('email và password là bắt buộc');
    err.status = 400;
    throw err;
  }

  const { rows } = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

const getProfile = async (id) => {
  const { rows } = await db.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return rows[0];
};

module.exports = { register, login, getProfile };
