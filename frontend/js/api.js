/**
 * FoodieGo — API Wrapper
 * Tất cả các call lên backend đều đi qua file này
 */

const API_BASE = 'http://localhost:3000/api';

// ── Token helpers ──────────────────────────────────────────────────
const getToken  = ()      => localStorage.getItem('fg_token');
const setToken  = (token) => localStorage.setItem('fg_token', token);
const clearToken = ()     => localStorage.removeItem('fg_token');

const getUser  = ()     => JSON.parse(localStorage.getItem('fg_user') || 'null');
const setUser  = (user) => localStorage.setItem('fg_user', JSON.stringify(user));
const clearUser = ()    => localStorage.removeItem('fg_user');

// ── Core fetch wrapper ─────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ── Auth ───────────────────────────────────────────────────────────
const authAPI = {
  register: (name, email, password, role = 'customer') =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),

  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getProfile: () => apiFetch('/auth/profile'),
};

// ── Restaurants ────────────────────────────────────────────────────
const restaurantsAPI = {
  getAll:  ()       => apiFetch('/restaurants'),
  getById: (id)     => apiFetch(`/restaurants/${id}`),
  create:  (data)   => apiFetch('/restaurants', { method: 'POST', body: JSON.stringify(data) }),
  update:  (id, data) => apiFetch(`/restaurants/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ── Menu Items ─────────────────────────────────────────────────────
const menuAPI = {
  getByRestaurant: (restaurantId) => apiFetch(`/restaurants/${restaurantId}/menu-items`),
  create:  (restaurantId, data)   => apiFetch(`/restaurants/${restaurantId}/menu-items`, { method: 'POST', body: JSON.stringify(data) }),
  update:  (id, data)             => apiFetch(`/menu-items/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete:  (id)                   => apiFetch(`/menu-items/${id}`, { method: 'DELETE' }),
};

// ── Orders ─────────────────────────────────────────────────────────
const ordersAPI = {
  create:      (data)   => apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getMy:       ()       => apiFetch('/orders/my'),
  getById:     (id)     => apiFetch(`/orders/${id}`),
  updateStatus:(id, status) => apiFetch(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ── Users (Admin) ──────────────────────────────────────────────────
const usersAPI = {
  getAll:     () => apiFetch('/users'),
  updateRole: (id, role) => apiFetch(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
};

// ── Reviews ────────────────────────────────────────────────────
const reviewsAPI = {
  getByRestaurant: (restaurantId) => apiFetch(`/restaurants/${restaurantId}/reviews`),
  create: (restaurantId, rating, comment) =>
    apiFetch(`/restaurants/${restaurantId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    }),
};

// ── Revenue ────────────────────────────────────────────────────
const revenueAPI = {
  getByRestaurant: (restaurantId) => apiFetch(`/restaurants/${restaurantId}/revenue`),
};

// ── Auth State Helpers ─────────────────────────────────────────────
function isLoggedIn()    { return !!getToken(); }
function isAdmin()       { return getUser()?.role === 'admin'; }
function isRestaurant()  { return getUser()?.role === 'restaurant'; }
function isCustomer()    { return getUser()?.role === 'customer'; }

function logout() {
  clearToken();
  clearUser();
  window.location.href = 'login.html';
}

// ── Toast Notification ─────────────────────────────────────────────
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ''}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ── Format helpers ─────────────────────────────────────────────────
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}

function statusBadge(status) {
  const labels = {
    pending: 'Chờ xác nhận', accepted: 'Đã xác nhận', preparing: 'Đang chuẩn bị',
    delivering: 'Đang giao', completed: 'Hoàn thành', cancelled: 'Đã hủy',
  };
  return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}

// ── Redirect if not logged in ──────────────────────────────────────
function requireAuth() {
  if (!isLoggedIn()) { window.location.href = 'login.html'; return false; }
  return true;
}
function requireAdmin() {
  if (!isLoggedIn() || !isAdmin()) { window.location.href = 'index.html'; return false; }
  return true;
}
