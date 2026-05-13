import { motion } from 'framer-motion';
import { Video, Circle, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

const CameraFeedCard = ({ camera, delay = 0 }) => {
  const statusColors = {
    active: 'text-success border-success/30 bg-success/10',
    inactive: 'text-gray-400 border-gray-600 bg-gray-800/50',
    maintenance: 'text-warning border-warning/30 bg-warning/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl overflow-hidden hover:border-info/50 transition-all duration-300 group"
    >
      {/* Video Feed */}
      <div className="relative aspect-video bg-navy-900 overflow-hidden">
        {/* Simulated CCTV Feed */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-950">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-info to-transparent animate-scan" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-16 h-16 text-navy-700 group-hover:text-info transition-colors" />
          </div>
        </div>

        {/* Live Indicator */}
        {camera.status === 'active' && (
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-danger/90 backdrop-blur-sm rounded-full">
            <Circle className="w-2 h-2 fill-white animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Live</span>
          </div>
        )}

        {/* Camera ID */}
        <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
          <span className="text-xs font-mono font-bold text-white">{camera.id}</span>
        </div>

        {/* Timestamp */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
          <span className="text-xs font-mono text-white">
            {format(new Date(), 'HH:mm:ss')}
          </span>
        </div>

        {/* Detection Overlay */}
        {camera.status === 'active' && (
          <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-success/90 backdrop-blur-sm rounded-lg">
            <span className="text-xs font-bold text-white">AI Active</span>
          </div>
        )}
      </div>

      {/* Camera Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{camera.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{camera.zone}</span>
            </div>
          </div>
          <span
            className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${
              statusColors[camera.status]
            }`}
          >
            {camera.status}
          </span>
        </div>

        {/* Detection Badges */}
        {camera.detectionTypes && (
          <div className="flex flex-wrap gap-1 mb-3">
            {camera.detectionTypes.smoking && (
              <span className="px-2 py-1 text-xs bg-danger/20 text-danger border border-danger/30 rounded-full font-medium">
                🚬 Smoking
              </span>
            )}
            {camera.detectionTypes.sleeping && (
              <span className="px-2 py-1 text-xs bg-warning/20 text-warning border border-warning/30 rounded-full font-medium">
                😴 Sleeping
              </span>
            )}
            {camera.detectionTypes.fire && (
              <span className="px-2 py-1 text-xs bg-danger/20 text-danger border border-danger/30 rounded-full font-medium">
                🔥 Fire
              </span>
            )}
            {camera.detectionTypes.mobile && (
              <span className="px-2 py-1 text-xs bg-warning/20 text-warning border border-warning/30 rounded-full font-medium">
                📱 Mobile
              </span>
            )}
            {camera.detectionTypes.unethical && (
              <span className="px-2 py-1 text-xs bg-danger/20 text-danger border border-danger/30 rounded-full font-medium">
                ⚠️ Unethical
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-navy-700/50">
          <div>
            <p className="text-xs text-gray-400 mb-1">Resolution</p>
            <p className="text-sm font-bold text-white">{camera.resolution}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Health</p>
            <p className="text-sm font-bold text-success">{camera.health}%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CameraFeedCard;
