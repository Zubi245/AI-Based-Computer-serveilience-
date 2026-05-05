import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import { alertService } from '../services/alertService';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({
    severity: '',
    status: '',
    camera: '',
  });
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    loadAlerts();
  }, [filters]);

  const loadAlerts = async () => {
    try {
      const data = await alertService.getAllAlerts(filters);
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await alertService.acknowledgeAlert(id, user.email);
      toast.success('Alert acknowledged');
      loadAlerts();
    } catch (error) {
      toast.error('Failed to acknowledge alert');
    }
  };

  const handleResolve = async (id) => {
    try {
      await alertService.resolveAlert(id, user.email);
      toast.success('Alert resolved');
      loadAlerts();
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Alert Management</h1>
          <p className="text-gray-400">Monitor and manage security violations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-info/20 to-info/5 border border-info/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Total Alerts</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-danger/20 to-danger/5 border border-danger/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Active</p>
          <p className="text-3xl font-bold text-danger">{stats.active}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Acknowledged</p>
          <p className="text-3xl font-bold text-warning">{stats.acknowledged}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Resolved</p>
          <p className="text-3xl font-bold text-success">{stats.resolved}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-white">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="px-4 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
          <button
            onClick={() => setFilters({ severity: '', status: '', camera: '' })}
            className="px-4 py-2 bg-navy-800/50 hover:bg-navy-800 border border-navy-700/50 rounded-lg text-white transition-all"
          >
            Clear Filters
          </button>
        </div>
      </motion.div>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-navy-800/50 rounded-xl animate-pulse" />
          ))
        ) : alerts.length === 0 ? (
          <div className="text-center py-12 bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl">
            <p className="text-gray-400">No alerts found</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
              delay={index * 0.05}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
