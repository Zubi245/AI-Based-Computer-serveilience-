'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, AlertTriangle, CheckCircle, Activity, Server, Users, Circle } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import CameraFeedCard from '@/components/CameraFeedCard';
import { cameraService } from '@/services/cameraService';
import { alertService } from '@/services/alertService';
import { socketService } from '@/services/socketService';
import { authService } from '@/services/authService';

export default function Dashboard() {
  const [cameras, setCameras] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverHealth, setServerHealth] = useState(98);
  const [connectedUsers, setConnectedUsers] = useState(12);
  const [recordingCount, setRecordingCount] = useState(0);

  useEffect(() => {
    loadData();

    const token = authService.getToken();
    socketService.connect(token);

    const unsubscribeAlert = socketService.onAlert((newAlert: any) => {
      setAlerts((prev) => [newAlert, ...prev]);
    });

    const unsubscribeCameraStatus = socketService.onCameraStatus((data: any) => {
      setCameras((prev) =>
        prev.map((cam) =>
          cam.id === data.cameraId ? { ...cam, status: data.status } : cam
        )
      );
    });

    const unsubscribeCameraHealth = socketService.onCameraHealth((data: any) => {
      setCameras((prev) =>
        prev.map((cam) =>
          cam.id === data.cameraId ? { ...cam, health: data.health } : cam
        )
      );
    });

    const unsubscribeRecording = socketService.onRecording((data: any) => {
      if (data.action === 'started') {
        setRecordingCount((prev) => prev + 1);
      } else if (data.action === 'stopped') {
        setRecordingCount((prev) => Math.max(0, prev - 1));
      }
    });

    const unsubscribeSystemHealth = socketService.onSystemHealth((data: any) => {
      if (data.health !== undefined) setServerHealth(data.health);
      if (data.connectedUsers !== undefined) setConnectedUsers(data.connectedUsers);
    });

    try {
      socketService.getRecordingStatus();
    } catch (e) {}

    return () => {
      unsubscribeAlert();
      unsubscribeCameraStatus();
      unsubscribeCameraHealth();
      unsubscribeRecording();
      unsubscribeSystemHealth();
    };
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

  const activeCameras = cameras.filter((c) => c.status === 'active').length;
  const activeViolations = alerts.filter((a) => a.status === 'active').length;
  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Surveillance Dashboard</h1>
        <p className="text-gray-400">Real-time monitoring and AI-powered detection system</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          icon={<Camera className="w-5 h-5" />}
          title="Active Cameras"
          value={activeCameras}
          color="info"
          delay={0.1}
        />
        <MetricCard
          icon={<AlertTriangle className="w-5 h-5" />}
          title="Active Violations"
          value={activeViolations}
          color="danger"
          delay={0.2}
        />
        <MetricCard
          icon={<CheckCircle className="w-5 h-5" />}
          title="Resolved Alerts"
          value={resolvedAlerts}
          color="success"
          delay={0.3}
        />
        <MetricCard
          icon={<Activity className="w-5 h-5" />}
          title="Detection Accuracy"
          value="94.2%"
          trend="up"
          trendValue="+2.1%"
          color="success"
          delay={0.4}
        />
        <MetricCard
          icon={<Server className="w-5 h-5" />}
          title="Server Health"
          value={serverHealth + '%'}
          color={serverHealth > 80 ? 'success' : serverHealth > 50 ? 'warning' : 'danger'}
          delay={0.5}
        />
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          title="Connected Users"
          value={connectedUsers}
          color="info"
          delay={0.6}
        />
        <MetricCard
          icon={<Circle className="w-5 h-5" />}
          title="Recording Now"
          value={recordingCount}
          color={recordingCount > 0 ? 'danger' : 'info'}
          delay={0.7}
        />
      </div>

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
            {cameras.map((camera: any, index: number) => (
              <CameraFeedCard key={camera.id} camera={camera} delay={index * 0.1} />
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert: any, index: number) => (
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
}
