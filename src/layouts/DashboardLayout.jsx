import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import AlertCard from '../components/AlertCard';
import { alertService } from '../services/alertService';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const user = authService.getCurrentUser();

  useEffect(() => {
    loadActiveAlerts();
    const interval = setInterval(loadActiveAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadActiveAlerts = async () => {
    try {
      const alerts = await alertService.getActiveAlerts();
      setActiveAlerts(alerts);
    } catch (error) {
      console.error('Error loading active alerts:', error);
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await alertService.acknowledgeAlert(id, user.email);
      toast.success('Alert acknowledged');
      loadActiveAlerts();
    } catch (error) {
      toast.error('Failed to acknowledge alert');
    }
  };

  const handleResolve = async (id) => {
    try {
      await alertService.resolveAlert(id, user.email);
      toast.success('Alert resolved');
      loadActiveAlerts();
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      <Sidebar />
      
      <div className="ml-64">
        <TopNavbar
          onNotificationClick={() => setShowAlertPanel(!showAlertPanel)}
          alertCount={activeAlerts.length}
        />
        
        <main className="pt-16 p-6">
          <Outlet />
        </main>
      </div>

      {/* Alert Panel */}
      <AnimatePresence>
        {showAlertPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowAlertPanel(false)}
            />
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="fixed right-0 top-0 h-screen w-96 bg-surface-card backdrop-blur-xl border-l border-navy-700/50 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Active Alerts</h2>
                  <button
                    onClick={() => setShowAlertPanel(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {activeAlerts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400">No active alerts</p>
                    </div>
                  ) : (
                    activeAlerts.map((alert, index) => (
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
