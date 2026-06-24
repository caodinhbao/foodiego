// Unit tests cho restaurants.service.js
// Thành viên B viết (Ngày 3)

const restaurantsService = require('./restaurants.service');

jest.mock('../../config/db', () => ({ query: jest.fn() }));
const db = require('../../config/db');

describe('Restaurants Service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('createRestaurant()', () => {
    it('should create a restaurant and return it', async () => {
      // TODO (Thành viên B - Ngày 3):
      // 1. Mock db.query trả về restaurant mới
      // 2. Gọi createRestaurant(ownerId, { name, address, phone })
      // 3. Expect kết quả có id, name, owner_id
      expect(true).toBe(true); // placeholder
    });

    it('should throw error if name is missing', async () => {
      // TODO: expect throw khi thiếu name
      expect(true).toBe(true); // placeholder
    });
  });

  describe('getAllRestaurants()', () => {
    it('should return list of active restaurants', async () => {
      // TODO (Thành viên B - Ngày 3):
      // Mock db.query trả về mảng nhà hàng
      // Expect kết quả là array
      expect(true).toBe(true); // placeholder
    });
  });

  describe('getRestaurantById()', () => {
    it('should return restaurant by id', async () => {
      // TODO: mock db.query trả 1 nhà hàng
      expect(true).toBe(true); // placeholder
    });

    it('should throw 404 error if restaurant not found', async () => {
      // TODO: mock db.query trả []  → expect throw
      expect(true).toBe(true); // placeholder
    });
  });

  describe('updateRestaurant()', () => {
    it('should update and return the restaurant', async () => {
      // TODO: mock query kiểm tra quyền + update
      expect(true).toBe(true); // placeholder
    });

    it('should throw error if owner does not match', async () => {
      // TODO: mock không tìm thấy restaurant với owner_id đó
      expect(true).toBe(true); // placeholder
    });
  });
});
