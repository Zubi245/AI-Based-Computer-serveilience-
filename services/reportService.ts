import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('texvision_auth_token')}` },
});

export const reportService = {
  getViolationsByCategory: async () => {
    const response = await axios.get(`${API_BASE_URL}/reports?type=violations-by-category`, getAuthHeader());
    return response.data.data;
  },

  getWeeklyComplianceTrend: async () => {
    const response = await axios.get(`${API_BASE_URL}/reports?type=weekly-trends`, getAuthHeader());
    return response.data.data;
  },

  getZoneRiskComparison: async () => {
    const response = await axios.get(`${API_BASE_URL}/reports?type=zone-risk-comparison`, getAuthHeader());
    return response.data.data;
  },

  getCameraActivityHeatmap: async () => {
    const response = await axios.get(`${API_BASE_URL}/reports?type=camera-activity`, getAuthHeader());
    return response.data.data;
  },

  getAlertResolutionTime: async () => {
    const response = await axios.get(`${API_BASE_URL}/reports?type=resolution-time`, getAuthHeader());
    return response.data.data;
  },

  getSystemHealthMetrics: async () => {
    const response = await axios.get(`${API_BASE_URL}/reports?type=system-health`, getAuthHeader());
    return response.data;
  },

  exportPDF: async (reportType: string) => {
    const response = await axios.post(`${API_BASE_URL}/reports/export/${reportType}`, { format: 'pdf' }, {
      ...getAuthHeader(),
      responseType: 'blob',
    });
    return response.data;
  },

  exportCSV: async (reportType: string) => {
    const response = await axios.post(`${API_BASE_URL}/reports/export/${reportType}`, { format: 'csv' }, {
      ...getAuthHeader(),
      responseType: 'blob',
    });
    return response.data;
  },
};
