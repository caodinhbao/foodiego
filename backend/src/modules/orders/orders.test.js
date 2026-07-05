// Unit tests cho orders.service.js
// Thành viên C viết (Ngày 3-4)

const { createOrder, STATUS_TRANSITIONS } = require('./orders.service');

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
      expect(STATUS_TRANSITIONS['pending']).toContain('accepted');
    });

    it('should allow pending → cancelled', () => {
      expect(STATUS_TRANSITIONS['pending']).toContain('cancelled');
    });

    it('should NOT allow completed → any status', () => {
      expect(STATUS_TRANSITIONS['completed']).toHaveLength(0);
    });

    it('should NOT allow delivering → accepted (skip step)', () => {
      expect(STATUS_TRANSITIONS['delivering']).not.toContain('accepted');
    });
  });

  // ── createOrder ────────────────────────────────────────────────────────────
  describe('createOrder()', () => {
    it('should create an order and return it with items', async () => {
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

      mockConn.execute
        .mockResolvedValueOnce([{ insertId: 101 }]) // insert order
        .mockResolvedValueOnce([]) // insert order items
        .mockResolvedValueOnce([[
          {
            id: 101,
            customer_id: 1,
            restaurant_id: 2,
            total_amount: 100000,
            delivery_fee: 15000,
            status: 'pending',
          },
        ]]) // select order
        .mockResolvedValueOnce([[
          {
            id: 1,
            order_id: 101,
            menu_item_id: 10,
            quantity: 2,
            unit_price: 50000,
            item_name: 'Phở bò',
          },
        ]]); // select order items

      const order = await createOrder(1, {
        restaurant_id: 2,
        items: [{ menu_item_id: 10, quantity: 2 }],
        distance_km: 3,
      });

      expect(order).toHaveProperty('id', 101);
      expect(order).toHaveProperty('total_amount', 100000);
      expect(order).toHaveProperty('delivery_fee', 15000);
      expect(order.items).toHaveLength(1);
      expect(order.items[0].item_name).toBe('Phở bò');
    });

    it('should throw error if items is empty', async () => {
      await expect(
        createOrder(1, {
          restaurant_id: 2,
          items: [],
        })
      ).rejects.toThrow('restaurant_id và items (array) là bắt buộc');
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

      _axios.post.mockResolvedValue({
        data: { delivery_fee: 15000 },
      });

      mockConn.execute
        .mockResolvedValueOnce([{ insertId: 101 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([[
          {
            id: 101,
            customer_id: 1,
            restaurant_id: 2,
            total_amount: 50000,
            delivery_fee: 15000,
            status: 'pending',
          },
        ]])
        .mockResolvedValueOnce([[]]);

      await expect(
        createOrder(1, {
          restaurant_id: 2,
          items: [{ menu_item_id: 10, quantity: 1 }],
          distance_km: 3,
        })
      ).rejects.toThrow('Món ăn không thuộc nhà hàng đã chọn');
    });
  });

  // ── getMyOrders ────────────────────────────────────────────────────────────
  describe('getMyOrders()', () => {
    it('should return orders for a customer', async () => {
      const getMyOrders = require('./orders.service').getMyOrders;
      _db.query
        .mockResolvedValueOnce({
          rows: [
            { id: 101, customer_id: 1, restaurant_id: 2, total_amount: 100000, status: 'pending' },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            { id: 1, order_id: 101, menu_item_id: 10, quantity: 2, unit_price: 50000, item_name: 'Phở bò' },
          ],
        });

      const orders = await getMyOrders(1);
      expect(orders).toHaveLength(1);
      expect(orders[0].items).toHaveLength(1);
      expect(orders[0].items[0].item_name).toBe('Phở bò');
    });
  });

  // ── updateOrderStatus ──────────────────────────────────────────────────────
  describe('updateOrderStatus()', () => {
    it('should update status from pending to accepted', async () => {
      const updateOrderStatus = require('./orders.service').updateOrderStatus;
      _db.query
        .mockResolvedValueOnce({
          rows: [
            { id: 101, status: 'pending', restaurant_id: 2, owner_id: 3, restaurant_owner_id: 3 },
          ],
        })
        .mockResolvedValueOnce({
          rows: [], // UPDATE query
        })
        .mockResolvedValueOnce({
          rows: [
            { id: 101, status: 'accepted' },
          ],
        });

      const updated = await updateOrderStatus(101, 3, 'accepted');
      expect(updated.status).toBe('accepted');
    });

    it('should throw error for invalid status transition', async () => {
      const updateOrderStatus = require('./orders.service').updateOrderStatus;
      _db.query.mockResolvedValueOnce({
        rows: [
          { id: 101, status: 'completed', restaurant_id: 2, restaurant_owner_id: 3 },
        ],
      });

      await expect(
        updateOrderStatus(101, 3, 'accepted')
      ).rejects.toThrow('Không thể chuyển từ "completed" sang "accepted"');
    });

    it('should throw error if order not owned by restaurant', async () => {
      const updateOrderStatus = require('./orders.service').updateOrderStatus;
      _db.query.mockResolvedValueOnce({
        rows: [
          { id: 101, status: 'pending', restaurant_id: 2, restaurant_owner_id: 99 },
        ],
      });

      await expect(
        updateOrderStatus(101, 3, 'accepted')
      ).rejects.toThrow('Forbidden: not the restaurant owner');
    });
  });
});
