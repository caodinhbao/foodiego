// Integration tests cho Auth API
// Thành viên A viết (Ngày 4) — dùng Supertest + DB test

const _request = require('supertest');
const _app = require('../../app');

/**
 * TODO (Thành viên A - Ngày 4):
 * Setup: trước khi chạy test, clean bảng users trong test DB
 * Teardown: sau khi xong, xóa data test
 *
 * Lưu ý: cần có file .env.test với DATABASE_URL trỏ đến DB test riêng
 * Hoặc dùng mock DB nếu không có DB trong CI
 */

describe('Auth API — Integration Tests', () => {
  const _testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@foodiego.com`,
    password: 'password123',
  };
  let _authToken;

  describe('POST /api/auth/register', () => {
    it('should register a new user and return 201', async () => {
      // TODO (Thành viên A - Ngày 4):
      // const res = await request(app).post('/api/auth/register').send(testUser);
      // expect(res.status).toBe(201);
      // expect(res.body.user).toHaveProperty('id');
      // expect(res.body.user.email).toBe(testUser.email);
      // expect(res.body.user).not.toHaveProperty('password_hash');
      expect(true).toBe(true); // placeholder
    });

    it('should return 409 if email already exists', async () => {
      // TODO: đăng ký lại email giống lần trước → expect 409
      expect(true).toBe(true); // placeholder
    });

    it('should return 400 if required fields are missing', async () => {
      // TODO: gửi body thiếu password → expect 400
      expect(true).toBe(true); // placeholder
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login and return JWT token', async () => {
      // TODO (Thành viên A - Ngày 4):
      // const res = await request(app).post('/api/auth/login').send({ email, password });
      // expect(res.status).toBe(200);
      // expect(res.body).toHaveProperty('token');
      // authToken = res.body.token; // lưu để dùng cho test sau
      expect(true).toBe(true); // placeholder
    });

    it('should return 401 for wrong password', async () => {
      // TODO: gửi sai password → expect 401
      expect(true).toBe(true); // placeholder
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile with valid token', async () => {
      // TODO (Thành viên A - Ngày 4):
      // const res = await request(app)
      //   .get('/api/auth/profile')
      //   .set('Authorization', `Bearer ${authToken}`);
      // expect(res.status).toBe(200);
      // expect(res.body.email).toBe(testUser.email);
      expect(true).toBe(true); // placeholder
    });

    it('should return 401 without token', async () => {
      // TODO: gọi không kèm token → expect 401
      expect(true).toBe(true); // placeholder
    });
  });
});
