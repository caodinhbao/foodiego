// Integration tests cho Orders API
// Thành viên C: Phạm Hải Thiên

const request = require('supertest');
const app = require('../../app');

jest.mock('../../config/db', () => ({
  query: jest.fn(),
  pool: {
    getConnection: jest.fn(),
  },
}));

const db = require('../../config/db');

jest.mock('axios');
const axios = require('axios');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const jwt = require('jsonwebtoken');

const mockConn = {
  beginTransaction: jest.fn(),
  execute: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  release: jest.fn(),
};

describe('Orders API — Integration Tests', () => {
  const customerToken = 'mock_customer_token';
  const customerPayload = {
    id: 1,
    email: 'cust@foodiego.com',
    role: 'customer',
  };

  const ownerToken = 'mock_owner_token';
  const ownerPayload = {
    id: 2,
    email: 'owner@foodiego.com',
    role: 'restaurant',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    db.pool.getConnection.mockResolvedValue(mockConn);
    mockConn.execute.mockReset();
    process.env.JWT_SECRET = 'test_secret_ci';
  });

  // ── POST /api/orders ──────────────────────────────────────────────────────
  describe('POST /api/orders', () => {
    it('should create an order and return 201', async () => {
      jwt.verify.mockReturnValue(customerPayload);

      db.query.mockResolvedValue({
        rows: [
          {
            id: 10,
            restaurant_id: 2,
            price: 50000,
            is_available: 1,
          },
        ],
      });

      axios.post.mockResolvedValue({
        data: { delivery_fee: 15000 },
      });

      mockConn.execute
        .mockResolvedValueOnce([{ insertId: 101 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]) // INSERT order_status_logs
        .mockResolvedValueOnce([[
          {
            id: 101,
            customer_id: 1,
            restaurant_id: 2,
            total_amount: 100000,
            delivery_fee: 15000,
            status: 'pending',
          },
        ]])
        .mockResolvedValueOnce([[
          {
            id: 1,
            order_id: 101,
            menu_item_id: 10,
            quantity: 2,
            unit_price: 50000,
            item_name: 'Phở bò',
          },
        ]]);

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          restaurant_id: 2,
          items: [{ menu_item_id: 10, quantity: 2 }],
          distance_km: 3,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id', 101);
      expect(res.body.status).toBe('pending');
      expect(res.body.items).toHaveLength(1);
    });

    it('should return 400 if items is missing', async () => {
      jwt.verify.mockReturnValue(customerPayload);

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          restaurant_id: 2,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('restaurant_id and items are required');
      expect(db.query).not.toHaveBeenCalled();
    });

    it('should return 401 if not authenticated', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('No token');
      });

      const res = await request(app)
        .post('/api/orders')
        .send({
          restaurant_id: 2,
          items: [{ menu_item_id: 10, quantity: 2 }],
        });

      expect(res.status).toBe(401);
    });

    it('should return 403 if role is not customer', async () => {
      jwt.verify.mockReturnValue(ownerPayload);

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          restaurant_id: 2,
          items: [{ menu_item_id: 10, quantity: 2 }],
        });

      expect(res.status).toBe(403);
    });
  });

  // ── GET /api/orders/my ────────────────────────────────────────────────────
  describe('GET /api/orders/my', () => {
    it('should return customer orders', async () => {
      jwt.verify.mockReturnValue(customerPayload);

      db.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 101,
              customer_id: 1,
              restaurant_id: 2,
              total_amount: 100000,
              status: 'pending',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              order_id: 101,
              menu_item_id: 10,
              quantity: 2,
              unit_price: 50000,
              item_name: 'Phở bò',
            },
          ],
        });

      const res = await request(app)
        .get('/api/orders/my')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].items).toHaveLength(1);
    });
  });

  // ── GET /api/orders/:id ───────────────────────────────────────────────────
  describe('GET /api/orders/:id', () => {
    it('should return an order with items for its customer', async () => {
      jwt.verify.mockReturnValue(customerPayload);

      db.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 101,
              customer_id: 1,
              restaurant_id: 2,
              total_amount: 100000,
              delivery_fee: 15000,
              status: 'pending',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              order_id: 101,
              menu_item_id: 10,
              quantity: 2,
              unit_price: 50000,
              item_name: 'Phở bò',
            },
          ],
        });

      const res = await request(app)
        .get('/api/orders/101')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(101);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].item_name).toBe('Phở bò');
    });

    it('should return 404 if the order does not exist', async () => {
      jwt.verify.mockReturnValue(customerPayload);

      db.query.mockResolvedValueOnce({
        rows: [],
      });

      const res = await request(app)
        .get('/api/orders/999')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Order not found');
    });

    it('should return 403 when customer views another customer order', async () => {
      jwt.verify.mockReturnValue(customerPayload);

      db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 101,
            customer_id: 99,
            restaurant_id: 2,
            status: 'pending',
          },
        ],
      });

      const res = await request(app)
        .get('/api/orders/101')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Forbidden');
    });
  });

  // ── PATCH /api/orders/:id/status ──────────────────────────────────────────
  describe('PATCH /api/orders/:id/status', () => {
    it('should update order status from pending to accepted', async () => {
      jwt.verify.mockReturnValue(ownerPayload);

      db.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 101,
              status: 'pending',
              restaurant_id: 2,
              restaurant_owner_id: 2,
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [],
        })
        .mockResolvedValueOnce({
          rows: [], // INSERT order_status_logs
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 101,
              status: 'accepted',
            },
          ],
        });

      const res = await request(app)
        .patch('/api/orders/101/status')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ status: 'accepted' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('accepted');
    });

    it('should return 400 if status is missing', async () => {
      jwt.verify.mockReturnValue(ownerPayload);

      const res = await request(app)
        .patch('/api/orders/101/status')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('status is required');
      expect(db.query).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid status transition', async () => {
      jwt.verify.mockReturnValue(ownerPayload);

      db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 101,
            status: 'completed',
            restaurant_id: 2,
            restaurant_owner_id: 2,
          },
        ],
      });

      const res = await request(app)
        .patch('/api/orders/101/status')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ status: 'accepted' });

      expect(res.status).toBe(400);
    });

    it('should return 403 if customer tries to update order status', async () => {
      jwt.verify.mockReturnValue(customerPayload);

      const res = await request(app)
        .patch('/api/orders/101/status')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ status: 'accepted' });

      expect(res.status).toBe(403);
    });
  });
});
