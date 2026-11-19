import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('texvision_auth_token')}` },
});

export const zoneService = {
  getAllZones: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/zones`, {
      ...getAuthHeader(),
      params,
    });
    return response.data.zones;
  },

  getZoneById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/zones/${id}`, getAuthHeader());
    return response.data.zone;
  },

  addZone: async (zoneData: any) => {
    const response = await axios.post(`${API_BASE_URL}/zones`, zoneData, getAuthHeader());
    return response.data.zone;
  },

  updateZone: async (id: string, zoneData: any) => {
    const response = await axios.put(`${API_BASE_URL}/zones/${id}`, zoneData, getAuthHeader());
    return response.data.zone;
  },

  deleteZone: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/zones/${id}`, getAuthHeader());
    return response.data;
  },

  toggleZoneStatus: async (id: string) => {
    const response = await axios.put(`${API_BASE_URL}/zones/${id}`, {}, getAuthHeader());
    return response.data.zone;
  },
};
