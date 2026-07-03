// Integration tests cho Auth API
// Thành viên A viết (Ngày 4) — dùng Supertest
// Chạy: npm test -- --testPathPattern=auth.integration

const request = require('supertest');
const app     = require('../../app');

// ── Test data ─────────────────────────────────────────────────────────────
const testUser = {
  name:     'Bảo Integration',
  email:    `bao_integration_${Date.now()}@foodiego.com`,
  password: 'password123',
};
let authToken; // lưu JWT để dùng cho các test sau

// ── POST /api/auth/register ───────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  it('should register a new user and return 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user).not.toHaveProperty('password_hash');
  });

  it('should return 409 if email already registered', async () => {
    // Đăng ký lại cùng email
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

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
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
    authToken = res.body.token; // lưu token
  });

  it('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('should return 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notexist@foodiego.com', password: 'password123' });

    expect(res.status).toBe(401);
  });
});

// ── GET /api/auth/profile ─────────────────────────────────────────────────
describe('GET /api/auth/profile', () => {
  it('should return user profile with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testUser.email);
    expect(res.body).not.toHaveProperty('password_hash');
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/auth/profile');

    expect(res.status).toBe(401);
  });

  it('should return 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalid_token_here');

    expect(res.status).toBe(401);
  });
});
