// Unit tests cho auth.service.js
// Thành viên A viết (Ngày 3)
// Chạy: npm test -- --testPathPattern=auth.test

const authService = require('./auth.service');

// ── Mock dependencies ─────────────────────────────────────────────────────
jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));
const db = require('../../config/db');

jest.mock('bcryptjs', () => ({
  hash:    jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));
const bcrypt = require('bcryptjs');

jest.mock('jsonwebtoken', () => ({
  sign:   jest.fn().mockReturnValue('mock_jwt_token'),
  verify: jest.fn(),
}));

// ── Helpers ───────────────────────────────────────────────────────────────
const mockUser = {
  id: 1,
  name: 'Bảo Test',
  email: 'bao@foodiego.com',
  role: 'customer',
  password_hash: 'hashed_password',
  created_at: new Date(),
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test_secret';
});

// ── register() ────────────────────────────────────────────────────────────
describe('register()', () => {
  it('should register a new user successfully', async () => {
    // Email chưa tồn tại → INSERT → SELECT user mới
    db.query
      .mockResolvedValueOnce({ rows: [] })                    // SELECT check email → rỗng
      .mockResolvedValueOnce({ rows: [{ insertId: 1 }] })     // INSERT
      .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Bảo Test', email: 'bao@foodiego.com', role: 'customer', created_at: new Date() }] }); // SELECT user

    const user = await authService.register('Bảo Test', 'bao@foodiego.com', 'password123');

    expect(user).toHaveProperty('id', 1);
    expect(user).toHaveProperty('email', 'bao@foodiego.com');
    expect(user).not.toHaveProperty('password_hash');
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
  });

  it('should throw 409 if email already exists', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // email đã tồn tại

    await expect(
      authService.register('Bảo', 'bao@foodiego.com', 'password123')
    ).rejects.toMatchObject({ status: 409, message: 'Email đã được sử dụng' });
  });

  it('should throw 400 if required fields are missing', async () => {
    await expect(
      authService.register('', 'bao@foodiego.com', 'password')
    ).rejects.toMatchObject({ status: 400 });

    await expect(
      authService.register('Bảo', '', 'password')
    ).rejects.toMatchObject({ status: 400 });
  });

  it('should default role to customer if not provided', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ insertId: 1 }] })
      .mockResolvedValueOnce({ rows: [{ ...mockUser }] });

    await authService.register('Bảo', 'bao@foodiego.com', 'password123');

    // Kiểm tra INSERT được gọi với role = 'customer'
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      expect.arrayContaining(['customer'])
    );
  });
});

// ── login() ───────────────────────────────────────────────────────────────
describe('login()', () => {
  it('should return token and user on valid credentials', async () => {
    db.query.mockResolvedValueOnce({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValueOnce(true);

    const result = await authService.login('bao@foodiego.com', 'password123');

    expect(result).toHaveProperty('token', 'mock_jwt_token');
    expect(result.user).toHaveProperty('email', 'bao@foodiego.com');
    expect(result.user).not.toHaveProperty('password_hash');
  });

  it('should throw 401 if user not found', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // không tìm thấy user

    await expect(
      authService.login('notfound@foodiego.com', 'password123')
    ).rejects.toMatchObject({ status: 401, message: 'Invalid credentials' });
  });

  it('should throw 401 if password is wrong', async () => {
    db.query.mockResolvedValueOnce({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValueOnce(false); // sai password

    await expect(
      authService.login('bao@foodiego.com', 'wrongpassword')
    ).rejects.toMatchObject({ status: 401, message: 'Invalid credentials' });
  });

  it('should throw 400 if fields are missing', async () => {
    await expect(
      authService.login('', 'password')
    ).rejects.toMatchObject({ status: 400 });
  });
});

// ── getProfile() ──────────────────────────────────────────────────────────
describe('getProfile()', () => {
  it('should return user info without password_hash', async () => {
    const safeUser = { id: 1, name: 'Bảo Test', email: 'bao@foodiego.com', role: 'customer', created_at: new Date() };
    db.query.mockResolvedValueOnce({ rows: [safeUser] });

    const result = await authService.getProfile(1);

    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('email', 'bao@foodiego.com');
    expect(result).not.toHaveProperty('password_hash');
  });

  it('should throw 404 if user not found', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    await expect(authService.getProfile(999)).rejects.toMatchObject({
      status: 404,
      message: 'User not found',
    });
  });
});
