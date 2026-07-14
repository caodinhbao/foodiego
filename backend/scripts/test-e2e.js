const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testE2E() {
  console.log('🔄 Bắt đầu kiểm tra API (End-to-End Test)...');
  
  try {
    // 1. Kiểm tra đăng nhập (Login)
    console.log('\n1. Đăng nhập Admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@foodiego.com',
      password: 'Password123!'
    });
    console.log('✅ Đăng nhập thành công. Token nhận được:', loginRes.data.token.substring(0, 20) + '...');
    
    const token = loginRes.data.token;

    // 2. Kiểm tra lấy thông tin profile (Auth Middleware)
    console.log('\n2. Lấy thông tin Profile...');
    const profileRes = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Lấy Profile thành công. Tên:', profileRes.data.name);

    // 3. Kiểm tra danh sách nhà hàng (Public route)
    console.log('\n3. Lấy danh sách nhà hàng...');
    const restaurantsRes = await axios.get(`${API_URL}/restaurants`);
    console.log(`✅ Lấy thành công ${restaurantsRes.data.length} nhà hàng.`);
    
    // 4. Kiểm tra danh sách menu của nhà hàng đầu tiên
    if (restaurantsRes.data.length > 0) {
      const firstResId = restaurantsRes.data[0].id;
      console.log(`\n4. Lấy thực đơn của nhà hàng ID ${firstResId}...`);
      const menuRes = await axios.get(`${API_URL}/restaurants/${firstResId}/menu-items`);
      console.log(`✅ Lấy thành công ${menuRes.data.length} món ăn.`);
    }

    console.log('\n🎉 TOÀN BỘ CÁC CHỨC NĂNG CƠ BẢN HOẠT ĐỘNG TỐT!');
  } catch (error) {
    console.error('\n❌ Lỗi khi kiểm tra:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testE2E();
