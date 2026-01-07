import axios from 'axios';

/* ======================================================
   BACKEND CONFIG (CRITICAL FIX)
   ====================================================== */

// ✅ Safe fallback backend URL (this FIXES your issue)
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  'https://ridsweb-backnd.vercel.app';

const API = `${BACKEND_URL}/api`;

console.log('✅ Backend API URL:', API);

/* ======================================================
   AXIOS INSTANCE
   ====================================================== */

const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ======================================================
   REQUEST INTERCEPTOR (AUTH TOKEN)
   ====================================================== */

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ======================================================
   RESPONSE INTERCEPTOR (AUTH FAIL SAFE)
   ====================================================== */

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

/* ======================================================
   AUTH API
   ====================================================== */

export const authAPI = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
};

/* ======================================================
   PROGRAMS API
   ====================================================== */

export const programsAPI = {
  getAll: async () => {
    const res = await apiClient.get('/programs');
    return res.data;
  },
};

/* ======================================================
   DONATIONS API (FIXED)
   ====================================================== */

export const donationsAPI = {
  createOrder: async (donationData) => {
    try {
      console.log('➡️ Creating donation order:', donationData);

      const res = await apiClient.post(
        '/donations/create-order',
        donationData
      );

      console.log('✅ Donation order response:', res.data);
      return res.data;

    } catch (error) {
      console.error('❌ Donation order failed:', error);
      console.error('❌ Backend response:', error?.response);
      throw error; // IMPORTANT: allow Donate.jsx to catch
    }
  },
};

/* ======================================================
   EXPORT CLIENT
   ====================================================== */

export default apiClient;
