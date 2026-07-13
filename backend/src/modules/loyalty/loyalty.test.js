const request = require('supertest');
const app = require('../../app');

jest.mock('../../config/db', () => ({ query: jest.fn() }));
const db = require('../../config/db');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));
const jwt = require('jsonwebtoken');

const { earnPoints } = require('./loyalty.router');

beforeEach(() => {
  jest.clearAllMocks();
  jwt.verify.mockReturnValue({ id: 1, role: 'customer' });
});

describe('Loyalty Router', () => {
  describe('GET /api/loyalty/balance', () => {
    it('should return balance and tier Dong', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ total: '100' }] });
      const res = await request(app).get('/api/loyalty/balance').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.points).toBe(100);
      expect(res.body.tier).toBe('Đồng');
    });

    it('should return balance and tier Bac', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ total: '1500' }] });
      const res = await request(app).get('/api/loyalty/balance').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.points).toBe(1500);
      expect(res.body.tier).toBe('Bạc');
    });

    it('should return balance and tier Vang', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ total: '3000' }] });
      const res = await request(app).get('/api/loyalty/balance').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.points).toBe(3000);
      expect(res.body.tier).toBe('Vàng');
    });

    it('should return balance and tier Kim cuong', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ total: '6000' }] });
      const res = await request(app).get('/api/loyalty/balance').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.points).toBe(6000);
      expect(res.body.tier).toBe('Kim cương');
    });

    it('should handle db error', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/loyalty/balance').set('Authorization', 'Bearer token');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/loyalty/history', () => {
    it('should return history', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ points: 100 }] });
      const res = await request(app).get('/api/loyalty/history').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should handle error', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/loyalty/history').set('Authorization', 'Bearer token');
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/loyalty/redeem', () => {
    it('should throw 400 if points < 100', async () => {
      const res = await request(app).post('/api/loyalty/redeem').set('Authorization', 'Bearer token').send({ points: 50 });
      expect(res.status).toBe(400);
    });

    it('should throw 400 if insufficient balance', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ total: '50' }] });
      const res = await request(app).post('/api/loyalty/redeem').set('Authorization', 'Bearer token').send({ points: 100 });
      expect(res.status).toBe(400);
    });

    it('should redeem points', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ total: '500' }] })
        .mockResolvedValueOnce({ rows: [] }); // insert
      
      const res = await request(app).post('/api/loyalty/redeem').set('Authorization', 'Bearer token').send({ points: 200 });
      expect(res.status).toBe(200);
      expect(res.body.discount_amount).toBe(20000);
      expect(res.body.remaining_points).toBe(300);
    });

    it('should handle error', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).post('/api/loyalty/redeem').set('Authorization', 'Bearer token').send({ points: 200 });
      expect(res.status).toBe(500);
    });
  });

  describe('earnPoints()', () => {
    it('should insert points based on total amount', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await earnPoints(1, 2, 50000); // 50 points
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO loyalty_points'),
        expect.arrayContaining([1, 2, 50, expect.any(String)])
      );
    });

    it('should not insert if points <= 0', async () => {
      await earnPoints(1, 2, 0);
      expect(db.query).not.toHaveBeenCalled();
    });

    it('should catch db error gracefully', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      await earnPoints(1, 2, 50000);
      expect(db.query).toHaveBeenCalled(); // shouldn't throw error outside
    });
  });
});
