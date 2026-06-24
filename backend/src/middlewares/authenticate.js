const jwt = require('jsonwebtoken');

/**
 * Middleware: xác thực JWT từ header Authorization: Bearer <token>
 * Sau khi verify thành công, gán req.user = { id, email, role }
 *
 * TODO (Thành viên A - Ngày 2):
 *  1. Lấy token từ header Authorization
 *  2. Kiểm tra token có tồn tại không → 401 nếu thiếu
 *  3. Verify token với JWT_SECRET
 *  4. Gán req.user = payload
 *  5. Gọi next()
 *  6. Trả 401 nếu token không hợp lệ hoặc hết hạn
 */
const authenticate = (req, res, next) => {
  // TODO: implement
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
