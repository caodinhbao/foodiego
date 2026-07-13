const request = require('supertest');
const app = require('../../app');

jest.mock('../../config/db', () => ({ query: jest.fn() }));
const db = require('../../config/db');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));
const jwt = require('jsonwebtoken');

beforeEach(() => {
  jest.clearAllMocks();
  jwt.verify.mockReturnValue({ id: 1, role: 'admin' });
});

describe('Admin Router', () => {
  describe('GET /api/admin/analytics', () => {
    it('should return analytics data', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ total: '100' }] }) // total orders
        .mockResolvedValueOnce({ rows: [{ total: '5000' }] }) // revenue
        .mockResolvedValueOnce({ rows: [{ total: '10' }] }) // new users
        .mockResolvedValueOnce({ rows: [{ total: '20' }] }) // new orders
        .mockResolvedValueOnce({ rows: [{ status: 'completed', count: '50' }] }) // status
        .mockResolvedValueOnce({ rows: [{ date: '2026-01-01', orders: '5', revenue: '500' }] }); // daily

      const res = await request(app).get('/api/admin/analytics').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.total_orders).toBe(100);
      expect(res.body.total_revenue).toBe(5000);
      expect(res.body.new_users_7d).toBe(10);
      expect(res.body.new_orders_7d).toBe(20);
    });

    it('should handle errors', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/admin/analytics').set('Authorization', 'Bearer token');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/admin/top-restaurants', () => {
    it('should return top restaurants', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Rest 1', revenue: '1000' }] });

      const res = await request(app).get('/api/admin/top-restaurants').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should handle errors', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/admin/top-restaurants').set('Authorization', 'Bearer token');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/admin/top-items', () => {
    it('should return top items', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Item 1', total_sold: '50' }] });

      const res = await request(app).get('/api/admin/top-items').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should handle errors', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/admin/top-items').set('Authorization', 'Bearer token');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/admin/users-stats', () => {
    it('should return user stats', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ role: 'customer', count: '50' }] });

      const res = await request(app).get('/api/admin/users-stats').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should handle errors', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/admin/users-stats').set('Authorization', 'Bearer token');
      expect(res.status).toBe(500);
    });
  });
});
