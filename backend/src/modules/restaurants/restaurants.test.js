/**
 * Unit tests - Restaurants Service
 */

jest.mock('../../config/db');

const db = require('../../config/db');

const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
} = require('./restaurants.service');

const mockRestaurant = {
  id: 1,
  owner_id: 5,
  name: 'Phở Hà Nội',
  address: '12 Lý Thường Kiệt',
  phone: '0901234561',
  status: 'active',
};

describe('Restaurants Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * createRestaurant()
   */
  describe('createRestaurant()', () => {
    it('should create a restaurant and return it', async () => {
      db.query
        .mockResolvedValueOnce({
          rows: {
            insertId: 1,
          },
        })
        .mockResolvedValueOnce({
          rows: [mockRestaurant],
        });

      const result = await createRestaurant(5, {
        name: 'Phở Hà Nội',
        address: '12 Lý Thường Kiệt',
        phone: '0901234561',
      });

      expect(result).toEqual(mockRestaurant);
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('should throw 400 if name is missing', async () => {
      await expect(
        createRestaurant(5, {
          address: '12 Lý Thường Kiệt',
        })
      ).rejects.toMatchObject({
        status: 400,
      });
    });

    it('should throw 400 if address is missing', async () => {
      await expect(
        createRestaurant(5, {
          name: 'Phở Hà Nội',
        })
      ).rejects.toMatchObject({
        status: 400,
      });
    });

    it('should use null for phone if not provided', async () => {
      db.query
        .mockResolvedValueOnce({
          rows: {
            insertId: 1,
          },
        })
        .mockResolvedValueOnce({
          rows: [
            {
              ...mockRestaurant,
              phone: null,
            },
          ],
        });

      const result = await createRestaurant(5, {
        name: 'Phở Hà Nội',
        address: '12 Lý Thường Kiệt',
      });

      expect(result.phone).toBeNull();
    });
  });

  /**
   * getAllRestaurants()
   */
  describe('getAllRestaurants()', () => {
    it('should return all active restaurants', async () => {
      db.query.mockResolvedValue({
        rows: [mockRestaurant],
      });

      const result = await getAllRestaurants();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockRestaurant);
    });

    it('should return empty array if no restaurants', async () => {
      db.query.mockResolvedValue({
        rows: [],
      });

      const result = await getAllRestaurants();

      expect(result).toEqual([]);
    });
  });

  /**
   * getRestaurantById()
   */
  describe('getRestaurantById()', () => {
    it('should return restaurant by id', async () => {
      db.query.mockResolvedValue({
        rows: [mockRestaurant],
      });

      const result = await getRestaurantById(1);

      expect(result).toEqual(mockRestaurant);
    });

    it('should throw 404 if restaurant not found', async () => {
      db.query.mockResolvedValue({
        rows: [],
      });

      await expect(
        getRestaurantById(999)
      ).rejects.toMatchObject({
        status: 404,
        message: 'Restaurant not found',
      });
    });
  });

  /**
   * updateRestaurant()
   */
  describe('updateRestaurant()', () => {
    it('should update restaurant fields', async () => {
      const updatedRestaurant = {
        ...mockRestaurant,
        name: 'Phở Đặc Biệt',
      };

      db.query
        .mockResolvedValueOnce({
          rows: [mockRestaurant],
        })
        .mockResolvedValueOnce({
          rows: [],
        })
        .mockResolvedValueOnce({
          rows: [updatedRestaurant],
        });

      const result = await updateRestaurant(1, 5, {
        name: 'Phở Đặc Biệt',
      });

      expect(result.name).toBe('Phở Đặc Biệt');
    });

    it('should throw 404 if restaurant not found', async () => {
      db.query.mockResolvedValueOnce({
        rows: [],
      });

      await expect(
        updateRestaurant(999, 5, {
          name: 'New Name',
        })
      ).rejects.toMatchObject({
        status: 404,
      });
    });

    it('should throw 403 if user is not owner', async () => {
      db.query.mockResolvedValueOnce({
        rows: [mockRestaurant],
      });

      await expect(
        updateRestaurant(1, 99, {
          name: 'New Name',
        })
      ).rejects.toMatchObject({
        status: 403,
      });
    });

    it('should return current restaurant if there is nothing to update', async () => {
      db.query.mockResolvedValueOnce({
        rows: [mockRestaurant],
      });

      const result = await updateRestaurant(1, 5, {});

      expect(result).toEqual(mockRestaurant);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should update multiple fields', async () => {
      const updatedRestaurant = {
        ...mockRestaurant,
        name: 'Mới',
        address: 'Đường Mới',
        phone: '0999',
      };

      db.query
        .mockResolvedValueOnce({
          rows: [mockRestaurant],
        })
        .mockResolvedValueOnce({
          rows: [],
        })
        .mockResolvedValueOnce({
          rows: [updatedRestaurant],
        });

      const result = await updateRestaurant(1, 5, {
        name: 'Mới',
        address: 'Đường Mới',
        phone: '0999',
      });

      expect(result).toEqual(updatedRestaurant);
    });
  });
});
