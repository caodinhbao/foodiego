/**
 * Unit tests — Users Service
 * Thành viên A: viết test cho users module
 */
jest.mock('../../config/db');
const db = require('../../config/db');
const { getAllUsers, updateUserRole } = require('./users.service');

describe('Users Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── getAllUsers ──────────────────────────────────────────────
  describe('getAllUsers()', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'Admin', email: 'admin@foodiego.com', role: 'admin', created_at: new Date() },
        { id: 2, name: 'An',    email: 'an@gmail.com',       role: 'customer', created_at: new Date() },
      ];
      db.query.mockResolvedValue({ rows: mockUsers });

      const result = await getAllUsers();

      expect(db.query).toHaveBeenCalledWith(
        'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
      );
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no users', async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await getAllUsers();
      expect(result).toEqual([]);
    });
  });

  // ── updateUserRole ───────────────────────────────────────────
  describe('updateUserRole()', () => {
    it('should update user role successfully', async () => {
      const updatedUser = { id: 2, name: 'An', email: 'an@gmail.com', role: 'restaurant' };
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 2 }] })      // SELECT check user exists
        .mockResolvedValueOnce({ rows: [] })                // UPDATE
        .mockResolvedValueOnce({ rows: [updatedUser] });    // SELECT result

      const result = await updateUserRole(2, 'restaurant');

      expect(result).toEqual(updatedUser);
      expect(db.query).toHaveBeenCalledTimes(3);
    });

    it('should throw 400 for invalid role', async () => {
      await expect(updateUserRole(1, 'superadmin')).rejects.toMatchObject({
        status: 400,
        message: expect.stringContaining('Role không hợp lệ'),
      });
      expect(db.query).not.toHaveBeenCalled();
    });

    it('should throw 404 if user not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // user not found

      await expect(updateUserRole(999, 'admin')).rejects.toMatchObject({
        status: 404,
        message: 'User not found',
      });
    });

    it('should accept all valid roles', async () => {
      const validRoles = ['customer', 'restaurant', 'admin'];
      for (const role of validRoles) {
        db.query
          .mockResolvedValueOnce({ rows: [{ id: 1 }] })
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce({ rows: [{ id: 1, role }] });

        const result = await updateUserRole(1, role);
        expect(result.role).toBe(role);
      }
    });
  });
});
