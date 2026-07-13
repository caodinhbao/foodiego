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
});

describe('Flash Sales Router', () => {
  describe('GET /api/flash-sales/active', () => {
    it('should return active flash sales', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{
          id: 1, menu_item_id: 2, discount_percent: 20,
          original_price: 100000, end_time: new Date()
        }]
      });

      const res = await request(app).get('/api/flash-sales/active');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].sale_price).toBe(80000);
    });

    it('should handle errors', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/flash-sales/active');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/flash-sales/item/:menuItemId', () => {
    it('should return null if no sale', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app).get('/api/flash-sales/item/99');
      expect(res.status).toBe(200);
      expect(res.body).toBeNull();
    });

    it('should return sale if exists', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, discount_percent: 15 }] });
      const res = await request(app).get('/api/flash-sales/item/1');
      expect(res.status).toBe(200);
      expect(res.body.discount_percent).toBe(15);
    });

    it('should handle errors', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/flash-sales/item/1');
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/flash-sales', () => {
    beforeEach(() => {
      jwt.verify.mockReturnValue({ id: 1, role: 'admin' });
    });

    it('should create flash sale', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 2, name: 'Pho', price: 100000 }] }) // check menu item
        .mockResolvedValueOnce({ rows: [{ insertId: 1 }] }); // insert

      const res = await request(app)
        .post('/api/flash-sales')
        .set('Authorization', 'Bearer token')
        .send({
          menu_item_id: 2,
          discount_percent: 20,
          start_time: '2026-01-01T00:00:00Z',
          end_time: '2026-01-02T00:00:00Z'
        });

      expect(res.status).toBe(201);
      expect(res.body.sale_price).toBe(80000);
    });

    it('should throw 400 if missing fields', async () => {
      const res = await request(app)
        .post('/api/flash-sales')
        .set('Authorization', 'Bearer token')
        .send({ menu_item_id: 2 });
      expect(res.status).toBe(400);
    });

    it('should throw 400 if invalid discount', async () => {
      const res = await request(app)
        .post('/api/flash-sales')
        .set('Authorization', 'Bearer token')
        .send({
          menu_item_id: 2, discount_percent: 105,
          start_time: '2026-01-01', end_time: '2026-01-02'
        });
      expect(res.status).toBe(400);
    });

    it('should throw 400 if end_time <= start_time', async () => {
      const res = await request(app)
        .post('/api/flash-sales')
        .set('Authorization', 'Bearer token')
        .send({
          menu_item_id: 2, discount_percent: 10,
          start_time: '2026-01-02', end_time: '2026-01-01'
        });
      expect(res.status).toBe(400);
    });

    it('should throw 404 if menu item not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/flash-sales')
        .set('Authorization', 'Bearer token')
        .send({
          menu_item_id: 99, discount_percent: 10,
          start_time: '2026-01-01', end_time: '2026-01-02'
        });
      expect(res.status).toBe(404);
    });

    it('should handle errors', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app)
        .post('/api/flash-sales')
        .set('Authorization', 'Bearer token')
        .send({
          menu_item_id: 2, discount_percent: 20,
          start_time: '2026-01-01T00:00:00Z',
          end_time: '2026-01-02T00:00:00Z'
        });
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/flash-sales/:id', () => {
    beforeEach(() => {
      jwt.verify.mockReturnValue({ id: 1, role: 'admin' });
    });

    it('should delete flash sale', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app)
        .delete('/api/flash-sales/1')
        .set('Authorization', 'Bearer token');
      expect(res.status).toBe(204);
    });

    it('should handle errors', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app)
        .delete('/api/flash-sales/1')
        .set('Authorization', 'Bearer token');
      expect(res.status).toBe(500);
    });
  });
});
