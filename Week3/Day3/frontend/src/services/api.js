// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api-docs',
  withCredentials: false,
});

// Attach token on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ---- Auth endpoints -- --
export const authAPI = {
    login: async (email, password) => {
    const { data } = await api.post('/api/users/login', { email, password });
    // Flatten so LoginPage gets { token, user }
    return { token: data.data.token, user: data.data.user };
    },

register: async (name, email, password) => {
  const { data } = await api.post('/api/users/register', { name, email, password });
  return { token: data.data.token, user: data.data.user };
},
};

// ---- Task endpoints ----
export const taskAPI = {
  list: async () => {
    const { data } = await api.get('/api/tasks');
    return data?.data?.tasks || []; // ✅ Extract only tasks
  },
  create: async (payload) => {
    const { data } = await api.post('/api/tasks', payload);
    return data?.data || data; // handle nested structure if any
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/api/tasks/${id}`, payload);
    return data?.data || data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/api/tasks/${id}`);
    return data?.data || data;
  },
};


export default api;