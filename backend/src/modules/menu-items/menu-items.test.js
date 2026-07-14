const menuItemsService = require('./menu-items.service');

jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));
const db = require('../../config/db');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('menu-items.service', () => {
  describe('createMenuItem()', () => {
    it('should create menu item successfully', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 1, owner_id: 2 }] }) // SELECT restaurant
        .mockResolvedValueOnce({ rows: { insertId: 1 } }) // INSERT menu item
        .mockResolvedValueOnce({ rows: [{ id: 1, restaurant_id: 1, name: 'Pho', price: 50000 }] }); // SELECT new item

      const result = await menuItemsService.createMenuItem(1, 2, { name: 'Pho', price: 50000 });
      expect(result.name).toBe('Pho');
      expect(db.query).toHaveBeenCalledTimes(3);
    });

    it('should throw 404 if restaurant not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        menuItemsService.createMenuItem(1, 2, { name: 'Pho', price: 50000 })
      ).rejects.toMatchObject({ status: 404 });
    });

    it('should throw 403 if not owner', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, owner_id: 3 }] });

      await expect(
        menuItemsService.createMenuItem(1, 2, { name: 'Pho', price: 50000 })
      ).rejects.toMatchObject({ status: 403 });
    });

    it('should throw 400 if name or price missing', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, owner_id: 2 }] });

      await expect(
        menuItemsService.createMenuItem(1, 2, { price: 50000 })
      ).rejects.toMatchObject({ status: 400 });
    });

    it('should throw 400 if price <= 0', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, owner_id: 2 }] });

      await expect(
        menuItemsService.createMenuItem(1, 2, { name: 'Pho', price: 0 })
      ).rejects.toMatchObject({ status: 400 });
    });
  });

  describe('getMenuByRestaurant()', () => {
    it('should return menu', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Pho' }] });

      const result = await menuItemsService.getMenuByRestaurant(1);
      expect(result).toHaveLength(1);
    });

    it('should throw 404 if restaurant not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        menuItemsService.getMenuByRestaurant(1)
      ).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('updateMenuItem()', () => {
    it('should update menu item', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 1, owner_id: 2, name: 'Old' }] }) // SELECT item
        .mockResolvedValueOnce({ rows: { affectedRows: 1 } }) // UPDATE
        .mockResolvedValueOnce({ rows: [{ id: 1, name: 'New' }] }); // SELECT updated item

      const result = await menuItemsService.updateMenuItem(1, 2, { name: 'New', description: 'Desc', price: 10000, is_available: false });
      expect(result.name).toBe('New');
      expect(db.query).toHaveBeenCalledTimes(3);
    });

    it('should throw 404 if item not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        menuItemsService.updateMenuItem(1, 2, { name: 'New' })
      ).rejects.toMatchObject({ status: 404 });
    });

    it('should throw 403 if not owner', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, owner_id: 3 }] });

      await expect(
        menuItemsService.updateMenuItem(1, 2, { name: 'New' })
      ).rejects.toMatchObject({ status: 403 });
    });

    it('should throw 400 if name empty', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, owner_id: 2 }] });

      await expect(
        menuItemsService.updateMenuItem(1, 2, { name: '   ' })
      ).rejects.toMatchObject({ status: 400 });
    });

    it('should throw 400 if price <= 0', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, owner_id: 2 }] });

      await expect(
        menuItemsService.updateMenuItem(1, 2, { price: -5 })
      ).rejects.toMatchObject({ status: 400 });
    });

    it('should return itemDetails if no fields provided', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, owner_id: 2, name: 'Pho' }] });

      const result = await menuItemsService.updateMenuItem(1, 2, {});
      expect(result.name).toBe('Pho');
      expect(result).not.toHaveProperty('owner_id');
    });
  });

  describe('deleteMenuItem()', () => {
    it('should delete menu item', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 1, owner_id: 2 }] })
        .mockResolvedValueOnce({ rows: [] });

      await menuItemsService.deleteMenuItem(1, 2);
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('should throw 404 if item not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        menuItemsService.deleteMenuItem(1, 2)
      ).rejects.toMatchObject({ status: 404 });
    });

    it('should throw 403 if not owner', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, owner_id: 3 }] });

      await expect(
        menuItemsService.deleteMenuItem(1, 2)
      ).rejects.toMatchObject({ status: 403 });
    });
  });
});
