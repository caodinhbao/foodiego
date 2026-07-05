const express = require('express');
const router = express.Router();
const restaurantsService = require('./restaurants.service');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

/**
 * POST /api/restaurants
 * Tạo nhà hàng mới — chỉ Restaurant Owner
 * Body: { name, address, phone }
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. authenticate + authorize('restaurant')
 *  2. Validate body
 *  3. Gọi service.createRestaurant(req.user.id, body)
 *  4. Trả 201 + restaurant
 */
router.post('/', authenticate, authorize('restaurant'), async (req, res, next) => {
  try {

    const restaurant = await restaurantsService.createRestaurant(req.user.id, req.body);
    return res.status(201).json(restaurant);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/restaurants
 * Xem danh sách nhà hàng — public
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. Gọi service.getAllRestaurants()
 *  2. Trả 200 + danh sách
 */
router.get('/', async (_req, res, next) => {
  try {
    // TODO: implement
    const restaurants = await restaurantsService.getAllRestaurants();
    return res.status(200).json(restaurants);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/restaurants/:id
 * Xem chi tiết nhà hàng — public
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. Gọi service.getRestaurantById(req.params.id)
 *  2. Trả 200 + restaurant hoặc 404
 */
router.get('/:id', async (req, res, next) => {
  try {
    // TODO: implement
    const restaurant = await restaurantsService.getRestaurantById(req.params.id);
    return res.status(200).json(restaurant);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/restaurants/:id
 * Cập nhật nhà hàng — chỉ Owner của nhà hàng đó
 * Body: { name?, address?, phone?, status? }
 *
 * TODO (Thành viên B - Ngày 2):
 *  1. authenticate + authorize('restaurant')
 *  2. Gọi service.updateRestaurant(id, req.user.id, body)
 *  3. Trả 200 + restaurant đã cập nhật
 */
router.patch('/:id', authenticate, authorize('restaurant'), async (req, res, next) => {
  try {
    // TODO: implement
    const restaurant = await restaurantsService.updateRestaurant(req.params.id, req.user.id, req.body);
    return res.status(200).json(restaurant);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
