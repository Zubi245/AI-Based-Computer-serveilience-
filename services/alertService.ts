import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('texvision_auth_token')}` },
});

export const alertService = {
  getAllAlerts: async (filters = {}) => {
    const response = await axios.get(`${API_BASE_URL}/alerts`, {
      ...getAuthHeader(),
      params: filters,
    });
    return response.data.alerts;
  },

  getAlertById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/alerts/${id}`, getAuthHeader());
    return response.data.alert;
  },

  acknowledgeAlert: async (id: string, acknowledgedBy: string, notes = '') => {
    const response = await axios.patch(`${API_BASE_URL}/alerts/${id}`, {
      status: 'acknowledged',
      acknowledged: true,
      acknowledgedBy,
      notes,
    }, getAuthHeader());
    return response.data.alert;
  },

  resolveAlert: async (id: string, resolvedBy: string, notes = '') => {
    const response = await axios.patch(`${API_BASE_URL}/alerts/${id}`, {
      status: 'resolved',
      resolvedBy,
      notes,
    }, getAuthHeader());
    return response.data.alert;
  },

  getActiveAlerts: async () => {
    const response = await axios.get(`${API_BASE_URL}/alerts`, {
      ...getAuthHeader(),
      params: { status: 'active' },
    });
    return response.data.alerts;
  },

  createAlert: async (alertData: any, snapshotFile: File | null = null) => {
    if (snapshotFile) {
      const formData = new FormData();
      formData.append('cameraId', alertData.cameraId);
      formData.append('zoneId', alertData.zoneId || '');
      formData.append('violationType', alertData.violationType);
      formData.append('violationLabel', alertData.violationLabel);
      formData.append('severity', alertData.severity);
      formData.append('confidence', (alertData.confidence || 0.85).toString());
      formData.append('snapshot', snapshotFile);

      const response = await axios.post(`${API_BASE_URL}/alerts`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('texvision_auth_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.alert;
    }

    const response = await axios.post(`${API_BASE_URL}/alerts`, alertData, getAuthHeader());
    return response.data.alert;
  },
};
