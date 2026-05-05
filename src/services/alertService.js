import { mockAlerts, generateRealtimeAlert } from '../data/mockAlerts';

export const alertService = {
  getAllAlerts: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockAlerts];

    if (filters.severity) {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }
    if (filters.status) {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }
    if (filters.camera) {
      filtered = filtered.filter(alert => alert.camera === filters.camera);
    }
    if (filters.zone) {
      filtered = filtered.filter(alert => alert.zone === filters.zone);
    }
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(alert => {
        const alertDate = new Date(alert.timestamp);
        return alertDate >= new Date(filters.startDate) && alertDate <= new Date(filters.endDate);
      });
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  getAlertById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAlerts.find(alert => alert.id === id);
  },

  acknowledgeAlert: async (id, acknowledgedBy, notes = '') => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const alert = mockAlerts.find(a => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date().toISOString();
      alert.status = 'acknowledged';
      if (notes) alert.notes = notes;
      return alert;
    }
    throw new Error('Alert not found');
  },

  resolveAlert: async (id, resolvedBy, notes = '') => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const alert = mockAlerts.find(a => a.id === id);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedBy = resolvedBy;
      alert.resolvedAt = new Date().toISOString();
      if (notes) alert.notes = notes;
      return alert;
    }
    throw new Error('Alert not found');
  },

  getActiveAlerts: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAlerts.filter(alert => alert.status === 'active');
  },

  generateNewAlert: () => {
    return generateRealtimeAlert();
  },
};
