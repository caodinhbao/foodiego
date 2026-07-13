// Unit tests cho orders.service.js
// Thành viên C: Phạm Hải Thiên

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  STATUS_TRANSITIONS,
} = require('./orders.service');

const mockConn = {
  beginTransaction: jest.fn(),
  execute: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  release: jest.fn(),
};

jest.mock('../../config/db', () => ({
  query: jest.fn(),
  pool: {
    getConnection: jest.fn(() => Promise.resolve(mockConn)),
  },
}));

jest.mock('axios');

const _axios = require('axios');
const _db = require('../../config/db');

describe('Orders Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConn.execute.mockReset();
  });

  // ── STATUS_TRANSITIONS ─────────────────────────────────────────────────────
  describe('STATUS_TRANSITIONS', () => {
    it('should allow pending → accepted', () => {
      expect(STATUS_TRANSITIONS.pending).toContain('accepted');
    });

    it('should allow pending → cancelled', () => {
      expect(STATUS_TRANSITIONS.pending).toContain('cancelled');
    });

    it('should NOT allow completed → any status', () => {
      expect(STATUS_TRANSITIONS.completed).toHaveLength(0);
    });

    it('should NOT allow delivering → accepted', () => {
      expect(STATUS_TRANSITIONS.delivering).not.toContain('accepted');
    });
  });

  // ── createOrder ────────────────────────────────────────────────────────────
  describe('createOrder()', () => {
    it('should create an order and return it with items', async () => {
      _db.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 10,
              restaurant_id: 2,
              price: 50000,
              is_available: 1,
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [] });

      _axios.post.mockResolvedValue({
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

      const order = await createOrder(1, {
        restaurant_id: 2,
        items: [{ menu_item_id: 10, quantity: 2 }],
        distance_km: 3,
      });

      expect(order).toHaveProperty('id', 101);
      expect(order).toHaveProperty('total_amount', 100000);
      expect(order).toHaveProperty('delivery_fee', 15000);
      expect(order.status).toBe('pending');
      expect(order.items).toHaveLength(1);
      expect(order.items[0].item_name).toBe('Phở bò');

      expect(mockConn.beginTransaction).toHaveBeenCalledTimes(1);
      expect(mockConn.commit).toHaveBeenCalledTimes(1);
      expect(mockConn.release).toHaveBeenCalledTimes(1);
    });

    it('should throw error if items is empty', async () => {
      await expect(
        createOrder(1, {
          restaurant_id: 2,
          items: [],
        })
      ).rejects.toThrow('restaurant_id và items (array) là bắt buộc');

      expect(_db.query).not.toHaveBeenCalled();
      expect(_db.pool.getConnection).not.toHaveBeenCalled();
    });

    it('should reject a menu item that belongs to another restaurant', async () => {
      _db.query.mockResolvedValue({
        rows: [
          {
            id: 10,
            restaurant_id: 99,
            price: 50000,
            is_available: 1,
          },
        ],
      });

      await expect(
        createOrder(1, {
          restaurant_id: 2,
          items: [{ menu_item_id: 10, quantity: 1 }],
          distance_km: 3,
        })
      ).rejects.toThrow('Món ăn không thuộc nhà hàng đã chọn');

      expect(_db.pool.getConnection).not.toHaveBeenCalled();
    });

    it('should reject an unavailable or missing menu item', async () => {
      // First call: user exists check → return valid user
      // Second call: menu items check → return empty (item not found/unavailable)
      _db.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // user exists
        .mockResolvedValueOnce({ rows: [] });           // menu item not found

      await expect(
        createOrder(1, {
          restaurant_id: 2,
          items: [{ menu_item_id: 999, quantity: 1 }],
          distance_km: 3,
        })
      ).rejects.toMatchObject({
        status: 400,
      });

      expect(_db.pool.getConnection).not.toHaveBeenCalled();
    });


    it('should use fallback delivery fee when delivery service fails', async () => {
      _db.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 10,
              restaurant_id: 2,
              price: 50000,
              is_available: 1,
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [] });

      _axios.post.mockRejectedValue(
        new Error('Delivery service unavailable')
      );

      mockConn.execute
        .mockResolvedValueOnce([{ insertId: 102 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]) // INSERT order_status_logs
        .mockResolvedValueOnce([[
          {
            id: 102,
            customer_id: 1,
            restaurant_id: 2,
            total_amount: 50000,
            delivery_fee: 5000,
            status: 'pending',
          },
        ]])
        .mockResolvedValueOnce([[]]);

      const order = await createOrder(1, {
        restaurant_id: 2,
        items: [{ menu_item_id: 10, quantity: 1 }],
        distance_km: 1,
      });

      expect(_axios.post).toHaveBeenCalledTimes(1);

      expect(mockConn.execute).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('INSERT INTO orders'),
        [1, 2, 50000, 5000, null, 0, null, 'cash', 'pending']
      );

      expect(order.delivery_fee).toBe(5000);
    });

    it('should roll back and release connection when transaction fails', async () => {
      _db.query.mockResolvedValue({
        rows: [
          {
            id: 10,
            restaurant_id: 2,
            price: 50000,
            is_available: 1,
          },
        ],
      });

      _axios.post.mockResolvedValue({
        data: { delivery_fee: 15000 },
      });

      mockConn.execute.mockRejectedValueOnce(
        new Error('Insert order failed')
      );

      await expect(
        createOrder(1, {
          restaurant_id: 2,
          items: [{ menu_item_id: 10, quantity: 1 }],
          distance_km: 3,
        })
      ).rejects.toThrow('Insert order failed');

      expect(mockConn.rollback).toHaveBeenCalledTimes(1);
      expect(mockConn.release).toHaveBeenCalledTimes(1);
    });
  });

  // ── getMyOrders ────────────────────────────────────────────────────────────
  describe('getMyOrders()', () => {
    it('should return orders for a customer with items', async () => {
      _db.query
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

      const orders = await getMyOrders(1);

      expect(orders).toHaveLength(1);
      expect(orders[0].items).toHaveLength(1);
      expect(orders[0].items[0].item_name).toBe('Phở bò');
    });
  });

  // ── getOrderById ───────────────────────────────────────────────────────────
  describe('getOrderById()', () => {
    it('should throw 404 if order does not exist', async () => {
      _db.query.mockResolvedValueOnce({
        rows: [],
      });

      await expect(
        getOrderById(999, { id: 1, role: 'customer' })
      ).rejects.toMatchObject({
        status: 404,
      });
    });

    it('should reject a customer viewing another customer order', async () => {
      _db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 101,
            customer_id: 2,
            restaurant_id: 2,
            status: 'pending',
          },
        ],
      });

      await expect(
        getOrderById(101, { id: 1, role: 'customer' })
      ).rejects.toMatchObject({
        status: 403,
      });
    });

    it('should reject a restaurant owner viewing another restaurant order', async () => {
      _db.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 101,
              customer_id: 1,
              restaurant_id: 2,
              status: 'pending',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              owner_id: 99,
            },
          ],
        });

      await expect(
        getOrderById(101, { id: 3, role: 'restaurant' })
      ).rejects.toMatchObject({
        status: 403,
      });
    });

    it('should return order details with items for its customer', async () => {
      _db.query
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

      const order = await getOrderById(101, {
        id: 1,
        role: 'customer',
      });

      expect(order.id).toBe(101);
      expect(order.items).toHaveLength(1);
      expect(order.items[0].item_name).toBe('Phở bò');
    });
  });

  // ── updateOrderStatus ──────────────────────────────────────────────────────
  describe('updateOrderStatus()', () => {
    it('should update status from pending to accepted', async () => {
      _db.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 101,
              status: 'pending',
              restaurant_id: 2,
              restaurant_owner_id: 3,
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

      const updated = await updateOrderStatus(101, 3, 'accepted');

      expect(updated.status).toBe('accepted');
    });

    it('should throw error for invalid status transition', async () => {
      _db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 101,
            status: 'completed',
            restaurant_id: 2,
            restaurant_owner_id: 3,
          },
        ],
      });

      await expect(
        updateOrderStatus(101, 3, 'accepted')
      ).rejects.toThrow('Không thể chuyển từ "completed" sang "accepted"');
    });

    it('should throw error if order is not owned by restaurant', async () => {
      _db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 101,
            status: 'pending',
            restaurant_id: 2,
            restaurant_owner_id: 99,
          },
        ],
      });

      await expect(
        updateOrderStatus(101, 3, 'accepted')
      ).rejects.toThrow('Forbidden: not the restaurant owner');
    });

    it('should reject an invalid status before querying the database', async () => {
      await expect(
        updateOrderStatus(101, 3, 'shipping')
      ).rejects.toMatchObject({
        status: 400,
      });

      expect(_db.query).not.toHaveBeenCalled();
    });

    it('should throw 404 if order does not exist', async () => {
      _db.query.mockResolvedValueOnce({
        rows: [],
      });

      await expect(
        updateOrderStatus(999, 3, 'accepted')
      ).rejects.toMatchObject({
        status: 404,
      });
    });
  });
});
