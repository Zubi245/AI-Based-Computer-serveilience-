import axios from 'axios';
import { mockCameras } from '../data/mockCameras';

const API_BASE_URL = '/api';

export const cameraService = {
  getAllCameras: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCameras;
  },

  getCameraById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCameras.find(cam => cam.id === id);
  },

  addCamera: async (cameraData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newCamera = {
      id: `CAM-${String(mockCameras.length + 1).padStart(3, '0')}`,
      ...cameraData,
      status: 'active',
      lastActive: new Date().toISOString(),
      health: 100,
    };
    mockCameras.push(newCamera);
    return newCamera;
  },

  updateCamera: async (id, cameraData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockCameras.findIndex(cam => cam.id === id);
    if (index !== -1) {
      mockCameras[index] = { ...mockCameras[index], ...cameraData };
      return mockCameras[index];
    }
    throw new Error('Camera not found');
  },

  deleteCamera: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockCameras.findIndex(cam => cam.id === id);
    if (index !== -1) {
      mockCameras.splice(index, 1);
      return true;
    }
    throw new Error('Camera not found');
  },

  testConnection: async (rtspUrl) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return Math.random() > 0.2;
  },

  toggleStatus: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const camera = mockCameras.find(cam => cam.id === id);
    if (camera) {
      camera.status = camera.status === 'active' ? 'inactive' : 'active';
      return camera;
    }
    throw new Error('Camera not found');
  },
};
