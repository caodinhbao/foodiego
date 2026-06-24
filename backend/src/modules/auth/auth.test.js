// Unit tests cho auth.service.js
// Thành viên A viết (Ngày 3)
// Chạy: npm test -- --testPathPattern=auth

const _authService = require('./auth.service');

jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));
const _db = require('../../config/db');

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));
const _bcrypt = require('bcryptjs');

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_jwt_token'),
  verify: jest.fn(),
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── register ───────────────────────────────────────────────────────────────
  describe('register()', () => {
    it('should register a new user successfully', async () => {
      // TODO (Thành viên A - Ngày 3):
      // 1. Mock db.query: lần 1 trả [] (email chưa tồn tại), lần 2 trả user mới
      // 2. Gọi authService.register(...)
      // 3. Expect trả về user có id, name, email, role
      // 4. Expect bcrypt.hash được gọi 1 lần
      expect(true).toBe(true); // placeholder — xóa dòng này khi implement
    });

    it('should throw error if email already exists', async () => {
      // TODO (Thành viên A - Ngày 3):
      // 1. Mock db.query: trả về user đã tồn tại
      // 2. Expect authService.register(...) throw error
      expect(true).toBe(true); // placeholder
    });
  });

  // ── login ──────────────────────────────────────────────────────────────────
  describe('login()', () => {
    it('should return token and user on valid credentials', async () => {
      // TODO (Thành viên A - Ngày 3):
      // 1. Mock db.query: trả về user có password_hash
      // 2. Mock bcrypt.compare: trả true
      // 3. Gọi authService.login(email, password)
      // 4. Expect nhận được { token, user }
      expect(true).toBe(true); // placeholder
    });

    it('should throw error on wrong password', async () => {
      // TODO: mock bcrypt.compare trả false → expect throw
      expect(true).toBe(true); // placeholder
    });

    it('should throw error if user not found', async () => {
      // TODO: mock db.query trả [] → expect throw
      expect(true).toBe(true); // placeholder
    });
  });

  // ── getProfile ─────────────────────────────────────────────────────────────
  describe('getProfile()', () => {
    it('should return user info without password', async () => {
      // TODO (Thành viên A - Ngày 3):
      // 1. Mock db.query: trả user info (không có password_hash)
      // 2. Expect kết quả không chứa password_hash
      expect(true).toBe(true); // placeholder
    });
  });
});
