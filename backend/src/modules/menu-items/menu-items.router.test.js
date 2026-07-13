const request = require('supertest');
const app = require('../../app');

jest.mock('../../config/db', () => ({ query: jest.fn() }));
const db = require('../../config/db');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));
const jwt = require('jsonwebtoken');

// We also mock the service since we just want to test the router layer
jest.mock('./menu-items.service');
const menuItemsService = require('./menu-items.service');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Menu Items Router', () => {
  describe('POST /api/restaurants/:restaurantId/menu-items', () => {
    beforeEach(() => {
      jwt.verify.mockReturnValue({ id: 1, role: 'restaurant' });
    });

    it('should return 201 on success', async () => {
      menuItemsService.createMenuItem.mockResolvedValueOnce({ id: 1, name: 'Pho' });

      const res = await request(app)
        .post('/api/restaurants/1/menu-items')
        .set('Authorization', 'Bearer token')
        .send({ name: 'Pho', price: 50000 });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Pho');
    });

    it('should handle errors', async () => {
      menuItemsService.createMenuItem.mockRejectedValueOnce(new Error('Service Error'));

      const res = await request(app)
        .post('/api/restaurants/1/menu-items')
        .set('Authorization', 'Bearer token')
        .send({ name: 'Pho', price: 50000 });

      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/restaurants/:restaurantId/menu-items', () => {
    it('should return items', async () => {
      menuItemsService.getMenuByRestaurant.mockResolvedValueOnce([{ id: 1, name: 'Pho' }]);

      const res = await request(app).get('/api/restaurants/1/menu-items');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should handle errors', async () => {
      menuItemsService.getMenuByRestaurant.mockRejectedValueOnce(new Error('Service Error'));

      const res = await request(app).get('/api/restaurants/1/menu-items');

      expect(res.status).toBe(500);
    });
  });

  describe('PATCH /api/menu-items/:id', () => {
    beforeEach(() => {
      jwt.verify.mockReturnValue({ id: 1, role: 'restaurant' });
    });

    it('should update item', async () => {
      menuItemsService.updateMenuItem.mockResolvedValueOnce({ id: 1, name: 'Pho 2' });

      const res = await request(app)
        .patch('/api/menu-items/1')
        .set('Authorization', 'Bearer token')
        .send({ name: 'Pho 2' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Pho 2');
    });

    it('should handle errors', async () => {
      menuItemsService.updateMenuItem.mockRejectedValueOnce(new Error('Service Error'));

      const res = await request(app)
        .patch('/api/menu-items/1')
        .set('Authorization', 'Bearer token')
        .send({ name: 'Pho 2' });

      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/menu-items/:id', () => {
    beforeEach(() => {
      jwt.verify.mockReturnValue({ id: 1, role: 'restaurant' });
    });

    it('should delete item', async () => {
      menuItemsService.deleteMenuItem.mockResolvedValueOnce();

      const res = await request(app)
        .delete('/api/menu-items/1')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(204);
    });

    it('should handle errors', async () => {
      menuItemsService.deleteMenuItem.mockRejectedValueOnce(new Error('Service Error'));

      const res = await request(app)
        .delete('/api/menu-items/1')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/menu-items/search', () => {
    it('should throw 400 if keyword too short', async () => {
      const res = await request(app).get('/api/menu-items/search?q=a');
      expect(res.status).toBe(400);
    });

    it('should return search results', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Pho' }] });

      const res = await request(app).get('/api/menu-items/search?q=pho');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should handle errors', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));
      const res = await request(app).get('/api/menu-items/search?q=pho');
      expect(res.status).toBe(500);
    });
  });
});
