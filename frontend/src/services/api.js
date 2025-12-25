import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      // Redirect to login if on admin pages
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============ Auth API ============
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// ============ Programs API ============
export const programsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/programs?${params}`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/programs/${id}`);
    return response.data;
  },
  
  create: async (programData) => {
    const response = await apiClient.post('/programs', programData);
    return response.data;
  },
  
  update: async (id, programData) => {
    const response = await apiClient.put(`/programs/${id}`, programData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/programs/${id}`);
    return response.data;
  },
};

// ============ News API ============
export const newsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/news?${params}`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/news/${id}`);
    return response.data;
  },
  
  create: async (newsData) => {
    const response = await apiClient.post('/news', newsData);
    return response.data;
  },
  
  update: async (id, newsData) => {
    const response = await apiClient.put(`/news/${id}`, newsData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/news/${id}`);
    return response.data;
  },
};

// ============ Stories API ============
export const storiesAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/stories?${params}`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/stories/${id}`);
    return response.data;
  },
  
  create: async (storyData) => {
    const response = await apiClient.post('/stories', storyData);
    return response.data;
  },
  
  update: async (id, storyData) => {
    const response = await apiClient.put(`/stories/${id}`, storyData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/stories/${id}`);
    return response.data;
  },
};

// ============ Gallery API ============
export const galleryAPI = {
  getAll: async (category = null) => {
    const params = category ? `?category=${category}` : '';
    const response = await apiClient.get(`/gallery${params}`);
    return response.data;
  },
  
  add: async (imageData) => {
    const response = await apiClient.post('/gallery', imageData);
    return response.data;
  },
  
  addBulk: async (images) => {
    const response = await apiClient.post('/gallery/bulk', images);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/gallery/${id}`);
    return response.data;
  },
};

// ============ Donations API ============
export const donationsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/donations?${params}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await apiClient.get('/donations/stats');
    return response.data;
  },
  
  create: async (donationData) => {
    const response = await apiClient.post('/donations', donationData);
    return response.data;
  },
  
  createOrder: async (donationData) => {
    const response = await apiClient.post('/donations/create-order', donationData);
    return response.data;
  },
  
  updateStatus: async (id, status, paymentId = null) => {
    const params = new URLSearchParams({ status });
    if (paymentId) params.append('payment_id', paymentId);
    const response = await apiClient.put(`/donations/${id}/status?${params}`);
    return response.data;
  },
};

// ============ Inquiries API ============
export const inquiriesAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/inquiries?${params}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await apiClient.get('/inquiries/stats');
    return response.data;
  },
  
  create: async (inquiryData) => {
    const response = await apiClient.post('/inquiries', inquiryData);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await apiClient.put(`/inquiries/${id}`, { status });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/inquiries/${id}`);
    return response.data;
  },
};

// ============ Volunteers API ============
export const volunteersAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/volunteers?${params}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await apiClient.get('/volunteers/stats');
    return response.data;
  },
  
  create: async (volunteerData) => {
    const response = await apiClient.post('/volunteers', volunteerData);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await apiClient.put(`/volunteers/${id}`, { status });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/volunteers/${id}`);
    return response.data;
  },
};

// ============ Newsletter API ============
export const newsletterAPI = {
  getAll: async () => {
    const response = await apiClient.get('/newsletter');
    return response.data;
  },
  
  getStats: async () => {
    const response = await apiClient.get('/newsletter/stats');
    return response.data;
  },
  
  subscribe: async (email) => {
    const response = await apiClient.post('/newsletter', { email });
    return response.data;
  },
  
  unsubscribe: async (id) => {
    const response = await apiClient.delete(`/newsletter/${id}`);
    return response.data;
  },
};

// ============ Dashboard API ============
export const dashboardAPI = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
  
  getRecentActivity: async () => {
    const response = await apiClient.get('/dashboard/recent');
    return response.data;
  },
};

export default apiClient;
