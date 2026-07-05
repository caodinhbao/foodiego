// Integration tests cho Auth API
// Thành viên A viết (Ngày 4) — dùng Supertest + mock DB
// Chạy: npm test -- --testPathPattern=auth.integration

const request = require('supertest');
const app     = require('../../app');

// ── Mock DB (không cần database thật) ────────────────────────────────────────
jest.mock('../../config/db', () => ({ query: jest.fn() }));
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
const jwt = require('jsonwebtoken');

// ── Setup ────────────────────────────────────────────────────────────────────
const mockUser = {
  id: 1,
  name: 'Bảo Integration',
  email: 'bao_integration@foodiego.com',
  role: 'customer',
  password_hash: 'hashed_password',
  created_at: new Date(),
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test_secret_ci';
});

// ── POST /api/auth/register ───────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  it('should register a new user and return 201', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })                     // email chưa tồn tại
      .mockResolvedValueOnce({ rows: [{ insertId: 1 }] })      // INSERT thành công
      .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Bảo Integration', email: 'bao_integration@foodiego.com', role: 'customer', created_at: new Date() }] });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bảo Integration', email: 'bao_integration@foodiego.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('bao_integration@foodiego.com');
    expect(res.body.user).not.toHaveProperty('password_hash');
  });

  it('should return 409 if email already registered', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // email đã tồn tại

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bảo', email: 'bao_integration@foodiego.com', password: 'password123' });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'missing@foodiego.com' }); // thiếu name và password

    expect(res.status).toBe(400);
  });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  it('should login and return JWT token', async () => {
    db.query.mockResolvedValueOnce({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bao_integration@foodiego.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('bao_integration@foodiego.com');
  });

  it('should return 401 for wrong password', async () => {
    db.query.mockResolvedValueOnce({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValueOnce(false);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bao_integration@foodiego.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('should return 401 for non-existent email', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notexist@foodiego.com', password: 'password123' });

    expect(res.status).toBe(401);
  });
});

// ── GET /api/auth/profile ─────────────────────────────────────────────────
describe('GET /api/auth/profile', () => {
  it('should return user profile with valid token', async () => {
    jwt.verify.mockReturnValueOnce({ id: 1, email: 'bao_integration@foodiego.com', role: 'customer' });
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Bảo Integration', email: 'bao_integration@foodiego.com', role: 'customer', created_at: new Date() }] });

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer mock_jwt_token');

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('bao_integration@foodiego.com');
    expect(res.body).not.toHaveProperty('password_hash');
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });

  it('should return 401 with invalid token', async () => {
    jwt.verify.mockImplementationOnce(() => { throw new Error('invalid'); });

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalid_token_here');

    expect(res.status).toBe(401);
  });
});
