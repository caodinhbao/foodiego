const db = require('../../config/db');

const VALID_ROLES = ['customer', 'restaurant', 'admin'];

const getAllUsers = async () => {
  const { rows } = await db.query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

const updateUserRole = async (id, role) => {
  if (!VALID_ROLES.includes(role)) {
    const err = new Error(`Role không hợp lệ. Hợp lệ: ${VALID_ROLES.join(', ')}`);
    err.status = 400;
    throw err;
  }

  const { rows: check } = await db.query('SELECT id FROM users WHERE id = ?', [id]);
  if (check.length === 0) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  const { rows } = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
  return rows[0];
};

const deleteUser = async (id) => {
  const { rows: check } = await db.query('SELECT id FROM users WHERE id = ?', [id]);
  if (check.length === 0) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  await db.query('DELETE FROM users WHERE id = ?', [id]);
  return { message: 'Xóa người dùng thành công' };
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
