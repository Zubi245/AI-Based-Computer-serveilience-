import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Camera, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AlertCard = ({ alert, onAcknowledge, onResolve, delay = 0 }) => {
  const severityConfig = {
    critical: {
      bg: 'from-danger/20 to-danger/5',
      border: 'border-danger/50',
      text: 'text-danger',
      icon: 'bg-danger/20 text-danger shadow-glow-red',
    },
    warning: {
      bg: 'from-warning/20 to-warning/5',
      border: 'border-warning/50',
      text: 'text-warning',
      icon: 'bg-warning/20 text-warning shadow-glow-amber',
    },
    info: {
      bg: 'from-info/20 to-info/5',
      border: 'border-info/50',
      text: 'text-info',
      icon: 'bg-info/20 text-info shadow-glow-blue',
    },
  };

  const config = severityConfig[alert.severity] || severityConfig.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${config.bg} backdrop-blur-xl border ${config.border} rounded-xl p-4 hover:scale-[1.02] transition-all duration-300`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-3 ${config.icon} rounded-lg flex-shrink-0`}>
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold ${config.text} mb-2`}>{alert.violationLabel}</h4>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Camera className="w-4 h-4" />
              <span>{alert.camera}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{alert.zone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
            </div>
          </div>

          {/* Confidence */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Confidence</span>
              <span className="font-bold text-white">{(alert.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${alert.confidence * 100}%` }}
                transition={{ delay: delay + 0.2, duration: 0.5 }}
                className={`h-full ${config.text === 'text-danger' ? 'bg-danger' : config.text === 'text-warning' ? 'bg-warning' : 'bg-info'}`}
              />
            </div>
          </div>

          {/* Actions */}
          {alert.status === 'active' && (
            <div className="flex gap-2">
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg text-sm font-medium transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Acknowledge
              </button>
              <button
                onClick={() => onResolve(alert.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-success/20 hover:bg-success/30 text-success border border-success/30 rounded-lg text-sm font-medium transition-all"
              >
                <XCircle className="w-4 h-4" />
                Resolve
              </button>
            </div>
          )}

          {alert.status === 'acknowledged' && (
            <div className="flex items-center gap-2 text-sm text-info">
              <CheckCircle className="w-4 h-4" />
              <span>Acknowledged by {alert.acknowledgedBy}</span>
            </div>
          )}

          {alert.status === 'resolved' && (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle className="w-4 h-4" />
              <span>Resolved by {alert.resolvedBy}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AlertCard;
