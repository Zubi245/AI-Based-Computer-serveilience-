import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, AlertTriangle, CheckCircle, Activity, Server, Users } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import CameraFeedCard from '../components/CameraFeedCard';
import { cameraService } from '../services/cameraService';
import { alertService } from '../services/alertService';

const Dashboard = () => {
  const [cameras, setCameras] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [camerasData, alertsData] = await Promise.all([
        cameraService.getAllCameras(),
        alertService.getActiveAlerts(),
      ]);
      setCameras(camerasData.slice(0, 6));
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeCameras = cameras.filter(c => c.status === 'active').length;
  const activeViolations = alerts.filter(a => a.status === 'active').length;
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Surveillance Dashboard</h1>
        <p className="text-gray-400">Real-time monitoring and AI-powered detection system</p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          icon={Camera}
          title="Active Cameras"
          value={activeCameras}
          color="info"
          delay={0.1}
        />
        <MetricCard
          icon={AlertTriangle}
          title="Active Violations"
          value={activeViolations}
          color="danger"
          delay={0.2}
        />
        <MetricCard
          icon={CheckCircle}
          title="Resolved Alerts"
          value={resolvedAlerts}
          color="success"
          delay={0.3}
        />
        <MetricCard
          icon={Activity}
          title="Detection Accuracy"
          value="94.2%"
          trend="up"
          trendValue="+2.1%"
          color="success"
          delay={0.4}
        />
        <MetricCard
          icon={Server}
          title="Server Health"
          value="98%"
          color="success"
          delay={0.5}
        />
        <MetricCard
          icon={Users}
          title="Connected Users"
          value="12"
          color="info"
          delay={0.6}
        />
      </div>

      {/* Live Camera Feeds */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Live Camera Feeds</h2>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-danger/20 border border-danger/30 rounded-lg">
            <div className="w-2 h-2 bg-danger rounded-full animate-pulse" />
            <span className="text-sm font-bold text-danger">LIVE</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video bg-navy-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cameras.map((camera, index) => (
              <CameraFeedCard key={camera.id} camera={camera} delay={index * 0.1} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-4 p-3 bg-navy-800/30 rounded-lg hover:bg-navy-800/50 transition-all"
            >
              <div className={`p-2 rounded-lg ${
                alert.severity === 'critical' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{alert.violationLabel}</p>
                <p className="text-sm text-gray-400">{alert.camera} • {alert.zone}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                alert.status === 'active' ? 'bg-danger/20 text-danger' :
                alert.status === 'acknowledged' ? 'bg-warning/20 text-warning' :
                'bg-success/20 text-success'
              }`}>
                {alert.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
