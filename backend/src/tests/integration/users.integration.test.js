/**
 * Integration tests — Users API (Admin)
 * Thành viên A: test users module
 */
const request = require('supertest');
const app     = require('../../app');

jest.mock('../../config/db');
const db = require('../../config/db');

// Mock JWT + authorize middleware
jest.mock('../../middlewares/authenticate', () => (req, _res, next) => {
  req.user = { id: 1, email: 'admin@foodiego.com', role: 'admin' };
  next();
});
jest.mock('../../middlewares/authorize', () => () => (_req, _res, next) => next());

const mockUsers = [
  { id: 1, name: 'Admin FoodieGo', email: 'admin@foodiego.com', role: 'admin', created_at: new Date() },
  { id: 2, name: 'Nguyễn Văn An',  email: 'an@gmail.com',       role: 'customer', created_at: new Date() },
];

describe('Users API (Integration)', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/users', () => {
    it('should return all users for admin', async () => {
      db.query.mockResolvedValue({ rows: mockUsers });

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
    });

    it('should return empty array when no users', async () => {
      db.query.mockResolvedValue({ rows: [] });
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer admin-token');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('PATCH /api/users/:id/role', () => {
    it('should update user role', async () => {
      const updatedUser = { id: 2, name: 'Nguyễn Văn An', email: 'an@gmail.com', role: 'restaurant' };
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 2 }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [updatedUser] });

      const res = await request(app)
        .patch('/api/users/2/role')
        .set('Authorization', 'Bearer admin-token')
        .send({ role: 'restaurant' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('restaurant');
    });

    it('should return 400 for invalid role', async () => {
      const res = await request(app)
        .patch('/api/users/2/role')
        .set('Authorization', 'Bearer admin-token')
        .send({ role: 'superadmin' });

      expect(res.status).toBe(400);
    });

    it('should return 404 if user not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const res = await request(app)
        .patch('/api/users/999/role')
        .set('Authorization', 'Bearer admin-token')
        .send({ role: 'customer' });
      expect(res.status).toBe(404);
    });
  });
});
