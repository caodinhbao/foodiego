const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testAdvancedFeatures() {
  console.log('🔄 Bắt đầu kiểm tra Đặt hàng & Tích điểm...');

  try {
    // 1. Đăng nhập khách hàng
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'khachhang1@gmail.com',
      password: 'Password123!'
    });
    const token = loginRes.data.token;
    console.log('✅ Khách hàng đăng nhập thành công.');

    // 2. Lấy danh sách món ăn từ nhà hàng đầu tiên
    const restaurantsRes = await axios.get(`${API_URL}/restaurants`);
    const restId = restaurantsRes.data[0].id;
    const menuRes = await axios.get(`${API_URL}/restaurants/${restId}/menu-items`);
    const menuItem = menuRes.data[0];

    // 3. Tiến hành đặt hàng (Payment/Order)
    const orderData = {
      restaurant_id: restId,
      items: [
        { menu_item_id: menuItem.id, quantity: 2, price: menuItem.price }
      ],
      delivery_address: '123 Đường Test, Quận 1',
      payment_method: 'COD' // Chức năng thanh toán giả định
    };

    const orderRes = await axios.post(`${API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const orderId = orderRes.data.id;
    console.log(`✅ Đã đặt hàng thành công. Mã đơn: #${orderId}, Tổng tiền: ${orderRes.data.total_amount}đ`);

    // 4. Nhà hàng hoàn thành đơn hàng để khách được tích điểm
    const restLoginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'food@restaurant.com',
      password: 'Password123!'
    });
    const restToken = restLoginRes.data.token;

    await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'accepted' }, {
      headers: { Authorization: `Bearer ${restToken}` }
    });
    await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'preparing' }, {
      headers: { Authorization: `Bearer ${restToken}` }
    });
    await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'delivering' }, {
      headers: { Authorization: `Bearer ${restToken}` }
    });
    await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'completed' }, {
      headers: { Authorization: `Bearer ${restToken}` }
    });
    console.log('✅ Đơn hàng đã được Nhà hàng chuyển tuần tự và đánh dấu Hoàn thành (Completed).');

    // 5. Kiểm tra điểm tích luỹ của khách hàng (Loyalty)
    const loyaltyRes = await axios.get(`${API_URL}/loyalty/balance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Kiểm tra Tích điểm: Điểm hiện tại = ${loyaltyRes.data.points} điểm (Hạng: ${loyaltyRes.data.tier})`);

  } catch (err) {
    console.error('❌ Lỗi:', err.response ? err.response.data : err.message);
  }
}

testAdvancedFeatures();
