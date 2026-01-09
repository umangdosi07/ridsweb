import axios from 'axios';

/* ================= BACKEND CONFIG ================= */

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  'https://ridsweb-backnd.vercel.app';

const API = `${BACKEND_URL}/api`;

/* ================= AXIOS INSTANCE ================= */

const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================= REQUEST INTERCEPTOR ================= */

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= RESPONSE INTERCEPTOR ================= */

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');

      if (
        window.location.pathname.startsWith('/admin') &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

/* ================= AUTH ================= */

export const authAPI = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
};

/* ================= PROGRAMS ================= */

export const programsAPI = {
  getAll: async () => {
    const res = await apiClient.get('/programs');
    return res.data;
  },
};

/* ================= INQUIRIES (CONTACT FORM) ================= */

export const inquiriesAPI = {
  getAll: async () => {
    const res = await apiClient.get('/inquiries');
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await apiClient.put(`/inquiries/${id}`, { status });
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/inquiries/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await apiClient.post('/inquiries', data);
    return res.data;
  },
};

/* ================= USERS ================= */

export const usersAPI = {
  getAll: async () => {
    const res = await apiClient.get('/users');
    return res.data;
  },

  create: async (data) => {
    const res = await apiClient.post('/users', data);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  },
};

/* ================= DASHBOARD ================= */

export const dashboardAPI = {
  getStats: async () => {
    const res = await apiClient.get('/dashboard/stats');
    return res.data;
  },

  getRecentActivity: async () => {
    const res = await apiClient.get('/dashboard/recent');
    return res.data;
  },
};

export default apiClient;
