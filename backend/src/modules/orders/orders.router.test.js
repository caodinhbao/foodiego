const request = require('supertest');
const app = require('../../app');

jest.mock('../../config/db', () => ({ query: jest.fn() }));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));
const jwt = require('jsonwebtoken');

jest.mock('./orders.service', () => ({
  createOrder: jest.fn(),
  getMyOrders: jest.fn(),
  getOrderById: jest.fn(),
  updateOrderStatus: jest.fn(),
}));
const ordersService = require('./orders.service');

describe('Orders Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/orders', () => {
    it('should create an order', async () => {
      jwt.verify.mockReturnValue({ id: 1, role: 'customer' });
      ordersService.createOrder.mockResolvedValueOnce({ id: 10, total_amount: 50000 });

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', 'Bearer valid')
        .send({ restaurant_id: 1, items: [{ menu_item_id: 1, quantity: 1 }], distance_km: 1.5 });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe(10);
    });

    it('should handle error', async () => {
      jwt.verify.mockReturnValue({ id: 1, role: 'customer' });
      ordersService.createOrder.mockRejectedValueOnce(new Error('Internal'));

      const res = await request(app).post('/api/orders').set('Authorization', 'Bearer valid').send({
        restaurant_id: 1, items: [{ menu_item_id: 1, quantity: 1 }], distance_km: 1.5
      });
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/orders/my', () => {
    it('should return user orders for customer', async () => {
      jwt.verify.mockReturnValue({ id: 1, role: 'customer' });
      ordersService.getMyOrders.mockResolvedValueOnce([{ id: 1 }]);

      const res = await request(app).get('/api/orders/my').set('Authorization', 'Bearer valid');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should handle error', async () => {
      jwt.verify.mockReturnValue({ id: 1, role: 'customer' });
      ordersService.getMyOrders.mockRejectedValueOnce(new Error('Internal'));

      const res = await request(app).get('/api/orders/my').set('Authorization', 'Bearer valid');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return order', async () => {
      jwt.verify.mockReturnValue({ id: 1, role: 'customer' });
      ordersService.getOrderById.mockResolvedValueOnce({ id: 10 });

      const res = await request(app).get('/api/orders/10').set('Authorization', 'Bearer valid');
      expect(res.status).toBe(200);
    });

    it('should handle error', async () => {
      jwt.verify.mockReturnValue({ id: 1, role: 'customer' });
      ordersService.getOrderById.mockRejectedValueOnce(new Error('Internal'));

      const res = await request(app).get('/api/orders/10').set('Authorization', 'Bearer valid');
      expect(res.status).toBe(500);
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('should update status', async () => {
      jwt.verify.mockReturnValue({ id: 1, role: 'restaurant' });
      ordersService.updateOrderStatus.mockResolvedValueOnce({ id: 10, status: 'accepted' });

      const res = await request(app)
        .patch('/api/orders/10/status')
        .set('Authorization', 'Bearer valid')
        .send({ status: 'accepted' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('accepted');
    });

    it('should handle error', async () => {
      jwt.verify.mockReturnValue({ id: 1, role: 'restaurant' });
      ordersService.updateOrderStatus.mockRejectedValueOnce(new Error('Internal'));

      const res = await request(app)
        .patch('/api/orders/10/status')
        .set('Authorization', 'Bearer valid')
        .send({ status: 'accepted' });

      expect(res.status).toBe(500);
    });
  });
});
