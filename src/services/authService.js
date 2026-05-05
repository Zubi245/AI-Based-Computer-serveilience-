import { mockUsers } from '../data/mockUsers';

const AUTH_TOKEN_KEY = 'texvision_auth_token';
const USER_DATA_KEY = 'texvision_user_data';

export const authService = {
  login: async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = mockUsers.find(
      u => u.email === email && u.password === password && u.status === 'active'
    );

    if (!user) {
      throw new Error('Invalid credentials or inactive account');
    }

    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

    return { token, user: userData };
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  hasPermission: (permission) => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  },
};
