import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('texvision_auth_token')}` },
});

export const userService = {
  getAllUsers: async () => {
    const response = await axios.get(`${API_BASE_URL}/users`, getAuthHeader());
    return response.data.users;
  },

  getUserById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`, getAuthHeader());
    return response.data.user;
  },

  addUser: async (userData: any) => {
    const response = await axios.post(`${API_BASE_URL}/users`, userData, getAuthHeader());
    return response.data.user;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData, getAuthHeader());
    return response.data.user;
  },

  deleteUser: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`, getAuthHeader());
    return response.data;
  },

  toggleUserStatus: async (id: string) => {
    const response = await axios.put(`${API_BASE_URL}/users/${id}/status`, {}, getAuthHeader());
    return response.data.user;
  },
};
