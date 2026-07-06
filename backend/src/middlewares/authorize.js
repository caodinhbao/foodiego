/**
 * Middleware: kiểm tra role của user sau khi đã authenticate
 * Sử dụng: router.get('/admin-only', authenticate, authorize('admin'), handler)
 *
 * @param {...string} roles - Các role được phép truy cập
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

module.exports = authorize;
