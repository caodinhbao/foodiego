// Integration tests cho Orders API
// Thành viên C viết (Ngày 4)

const _request = require('supertest');
const _app = require('../../app');

describe('Orders API — Integration Tests', () => {
  let _customerToken;
  let _ownerToken;
  let _restaurantId;
  let _menuItemId;
  let _orderId;

  /**
   * TODO (Thành viên C - Ngày 4):
   * beforeAll:
   *  1. Đăng ký + đăng nhập 1 customer → lưu customerToken
   *  2. Đăng ký + đăng nhập 1 restaurant owner → lưu ownerToken
   *  3. Tạo 1 restaurant → lưu restaurantId
   *  4. Tạo 1 menu item → lưu menuItemId
   */

  describe('POST /api/orders', () => {
    it('should create an order and return 201', async () => {
      // TODO (Thành viên C - Ngày 4):
      // const res = await request(app)
      //   .post('/api/orders')
      //   .set('Authorization', `Bearer ${customerToken}`)
      //   .send({
      //     restaurant_id: restaurantId,
      //     items: [{ menu_item_id: menuItemId, quantity: 2 }],
      //     distance_km: 3.0
      //   });
      // expect(res.status).toBe(201);
      // expect(res.body).toHaveProperty('id');
      // expect(res.body.status).toBe('pending');
      // orderId = res.body.id;
      expect(true).toBe(true); // placeholder
    });

    it('should return 401 if not authenticated', async () => {
      // TODO: gọi không có token → expect 401
      expect(true).toBe(true); // placeholder
    });

    it('should return 403 if role is not customer', async () => {
      // TODO: gọi với ownerToken → expect 403
      expect(true).toBe(true); // placeholder
    });
  });

  describe('GET /api/orders/my', () => {
    it('should return customer orders', async () => {
      // TODO: gọi với customerToken → expect array
      expect(true).toBe(true); // placeholder
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('should update order status from pending to accepted', async () => {
      // TODO (Thành viên C - Ngày 4):
      // const res = await request(app)
      //   .patch(`/api/orders/${orderId}/status`)
      //   .set('Authorization', `Bearer ${ownerToken}`)
      //   .send({ status: 'accepted' });
      // expect(res.status).toBe(200);
      // expect(res.body.status).toBe('accepted');
      expect(true).toBe(true); // placeholder
    });

    it('should return 400 for invalid status transition', async () => {
      // TODO: thử chuyển từ completed → accepted → expect 400
      expect(true).toBe(true); // placeholder
    });
  });
});
