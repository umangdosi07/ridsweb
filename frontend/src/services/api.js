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

/* ================= AUTH API ================= */

export const authAPI = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
};

/* ================= PROGRAMS API ================= */

export const programsAPI = {
  getAll: async () => {
    const res = await apiClient.get('/programs');
    return res.data;
  },
};

/* ================= NEWS API (🔥 FIXED) ================= */

export const newsAPI = {
  getAll: async () => {
    const res = await apiClient.get('/news');
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/news/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await apiClient.post('/news', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/news/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/news/${id}`);
    return res.data;
  },
};

/* ================= STORIES API ================= */

export const storiesAPI = {
  getAll: async () => {
    const res = await apiClient.get('/stories');
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/stories/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await apiClient.post('/stories', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/stories/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/stories/${id}`);
    return res.data;
  },
};

/* ================= DONATIONS API ================= */

export const donationsAPI = {
  createOrder: async (donationData) => {
    const res = await apiClient.post('/donations/create-order', donationData);
    return res.data;
  },
};

/* ================= NEWSLETTER API ================= */

export const newsletterAPI = {
  subscribe: async (email) => {
    const res = await apiClient.post('/newsletter', { email });
    return res.data;
  },
  getAll: async () => {
    const res = await apiClient.get('/newsletter');
    return res.data;
  },
};

/* ================= INQUIRIES API ================= */

export const inquiriesAPI = {
  create: async (data) => {
    const res = await apiClient.post('/inquiries', data);
    return res.data;
  },
  getAll: async () => {
    const res = await apiClient.get('/inquiries');
    return res.data;
  },
};

/* ================= VOLUNTEERS API ================= */

export const volunteersAPI = {
  create: async (data) => {
    const res = await apiClient.post('/volunteers', data);
    return res.data;
  },
  getAll: async () => {
    const res = await apiClient.get('/volunteers');
    return res.data;
  },
};

/* ================= USERS API ================= */

export const usersAPI = {
  getAll: async () => {
    const res = await apiClient.get('/users');
    return res.data;
  },
};

/* ================= DASHBOARD API ================= */

export const dashboardAPI = {
  getStats: async () => {
    const res = await apiClient.get('/dashboard/stats');
    return res.data;
  },
};

/* ================= EXPORT CLIENT ================= */

export default apiClient;
