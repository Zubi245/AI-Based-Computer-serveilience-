import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { authService } from '../services/authService';

const TopNavbar = ({ onNotificationClick, alertCount = 0 }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = authService.getCurrentUser();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-64 right-0 h-16 bg-surface-card backdrop-blur-xl border-b border-navy-700/50 z-30"
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cameras, zones, alerts..."
              className="w-full pl-10 pr-4 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus:ring-info/20 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* System Status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-success/10 border border-success/30 rounded-lg">
            <Activity className="w-4 h-4 text-success animate-pulse" />
            <span className="text-sm font-medium text-success">System Online</span>
          </div>

          {/* Date & Time */}
          <div className="hidden lg:block text-right">
            <p className="text-sm font-medium text-white">
              {format(currentTime, 'HH:mm:ss')}
            </p>
            <p className="text-xs text-gray-400">
              {format(currentTime, 'EEE, MMM dd, yyyy')}
            </p>
          </div>

          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-navy-800/50 rounded-lg transition-all"
          >
            <Bell className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
            {alertCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center shadow-glow-red"
              >
                {alertCount > 9 ? '9+' : alertCount}
              </motion.span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-navy-700/50">
            <div className="w-10 h-10 bg-gradient-to-br from-info to-info-dark rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopNavbar;
