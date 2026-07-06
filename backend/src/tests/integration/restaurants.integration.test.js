/**
 * Integration tests — Restaurants API
 * Thành viên A: bổ sung integration test cho restaurants
 */
const request = require('supertest');
const app     = require('../../app');

// Mock DB để tránh kết nối MySQL thật
jest.mock('../../config/db');
const db = require('../../config/db');

// Mock JWT middleware
jest.mock('../../middlewares/authenticate', () => (req, _res, next) => {
  req.user = { id: 5, email: 'owner@test.com', role: 'restaurant' };
  next();
});
jest.mock('../../middlewares/authorize', () => () => (_req, _res, next) => next());

const mockRestaurant = {
  id: 1, owner_id: 5,
  name: 'Phở Hà Nội', address: '12 Lý Thường Kiệt',
  phone: '0901234561', status: 'active', created_at: new Date(),
};

describe('Restaurants API (Integration)', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/restaurants', () => {
    it('should return list of active restaurants', async () => {
      db.query.mockResolvedValue({ rows: [mockRestaurant] });

      const res = await request(app).get('/api/restaurants');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].name).toBe('Phở Hà Nội');
    });
  });

  describe('GET /api/restaurants/:id', () => {
    it('should return restaurant by id', async () => {
      db.query.mockResolvedValue({ rows: [mockRestaurant] });

      const res = await request(app).get('/api/restaurants/1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });

    it('should return 404 if not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const res = await request(app).get('/api/restaurants/999');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/restaurants', () => {
    it('should create a restaurant', async () => {
      db.query
        .mockResolvedValueOnce({ rows: { insertId: 1 } })
        .mockResolvedValueOnce({ rows: [mockRestaurant] });

      const res = await request(app)
        .post('/api/restaurants')
        .set('Authorization', 'Bearer test-token')
        .send({ name: 'Phở Hà Nội', address: '12 Lý Thường Kiệt' });

      expect(res.status).toBe(201);
    });

    it('should return 400 if name missing', async () => {
      const res = await request(app)
        .post('/api/restaurants')
        .set('Authorization', 'Bearer test-token')
        .send({ address: '12 Lý Thường Kiệt' });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/restaurants/:id', () => {
    it('should update restaurant', async () => {
      const updated = { ...mockRestaurant, name: 'Phở Đặc Biệt' };
      db.query
        .mockResolvedValueOnce({ rows: [mockRestaurant] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [updated] });

      const res = await request(app)
        .patch('/api/restaurants/1')
        .set('Authorization', 'Bearer test-token')
        .send({ name: 'Phở Đặc Biệt' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Phở Đặc Biệt');
    });
  });
});
