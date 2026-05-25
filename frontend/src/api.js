const API_BASE = '/api';

export async function api(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error || 'เกิดข้อผิดพลาด');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const auth = {
  login: (email, password) =>
    api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name, email, password) =>
    api('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
};

export const classes = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.min_price) query.set('min_price', params.min_price);
    if (params.max_price) query.set('max_price', params.max_price);
    if (params.sort) query.set('sort', params.sort);
    if (params.order) query.set('order', params.order);
    const qs = query.toString();
    return api(`/classes${qs ? `?${qs}` : ''}`);
  },

  getById: (id) => api(`/classes/${id}`),
};

export const bookings = {
  create: (class_id) =>
    api('/bookings', { method: 'POST', body: JSON.stringify({ class_id }) }),

  getAll: () => api('/bookings'),
};
