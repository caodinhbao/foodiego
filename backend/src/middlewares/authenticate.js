const jwt = require('jsonwebtoken');

/**
 * Middleware: xác thực JWT từ header Authorization: Bearer <token>
 * Sau khi verify thành công, gán req.user = { id, email, role }
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists in DB
    if (process.env.NODE_ENV !== 'test') {
      const db = require('../config/db');
      const { rows } = await db.query('SELECT id FROM users WHERE id = ?', [payload.id]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'User has been deleted' });
      }
    }

    req.user = payload; // { id, email, role }
    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
