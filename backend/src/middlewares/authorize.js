/**
 * Middleware: kiểm tra role của user sau khi đã authenticate
 * Sử dụng: router.get('/admin-only', authenticate, authorize('admin'), handler)
 *
 * @param {...string} roles - Các role được phép truy cập
 *
 * TODO (Thành viên A - Ngày 2):
 *  1. Nhận vào danh sách roles cho phép
 *  2. Kiểm tra req.user.role có nằm trong danh sách không
 *  3. Nếu không → 403 Forbidden
 *  4. Nếu có → next()
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // TODO: implement
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

module.exports = authorize;
