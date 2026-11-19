import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    const { token, user } = response.data;

    localStorage.setItem('texvision_auth_token', token);
    localStorage.setItem('texvision_user_data', JSON.stringify(user));

    return { token, user };
  },

  logout: () => {
    localStorage.removeItem('texvision_auth_token');
    localStorage.removeItem('texvision_user_data');
  },

  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('texvision_user_data');
    return userData ? JSON.parse(userData) : null;
  },

  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('texvision_auth_token');
  },

  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('texvision_auth_token');
  },

  hasPermission: (permission: string) => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  },

  me: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('texvision_auth_token')}` },
    });
    return response.data.user;
  },
};
