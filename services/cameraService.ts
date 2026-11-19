import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('texvision_auth_token')}` },
});

export const cameraService = {
  getAllCameras: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/cameras`, {
      ...getAuthHeader(),
      params,
    });
    return response.data.cameras;
  },

  getCameraById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/cameras/${id}`, getAuthHeader());
    return response.data.camera;
  },

  addCamera: async (cameraData: any) => {
    const response = await axios.post(`${API_BASE_URL}/cameras`, cameraData, getAuthHeader());
    return response.data.camera;
  },

  updateCamera: async (id: string, cameraData: any) => {
    const response = await axios.put(`${API_BASE_URL}/cameras/${id}`, cameraData, getAuthHeader());
    return response.data.camera;
  },

  deleteCamera: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/cameras/${id}`, getAuthHeader());
    return response.data;
  },

  testConnection: async (rtspUrl: string) => {
    const response = await axios.post(`${API_BASE_URL}/cameras/test-connection`, { rtspUrl }, getAuthHeader());
    return response.data.success;
  },

  toggleStatus: async (id: string) => {
    const response = await axios.put(`${API_BASE_URL}/cameras/${id}`, {}, getAuthHeader());
    return response.data.camera;
  },
};
