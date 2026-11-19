'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface AlertCardProps {
  alert: any;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  delay?: number;
}

const severityColors: Record<string, string> = {
  critical: 'bg-danger/20 text-danger border border-danger/30',
  warning: 'bg-warning/20 text-warning border border-warning/30',
  info: 'bg-info/20 text-info border border-info/30',
};

export default function AlertCard({
  alert,
  onAcknowledge,
  onResolve,
  delay = 0,
}: AlertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-4 hover:border-info/50 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{alert.violationLabel}</p>
          <p className="text-xs text-gray-400">{alert.camera} • {alert.zone}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-bold rounded-full ${severityColors[alert.severity] || severityColors.info}`}
        >
          {alert.severity}
        </span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400">
            {format(new Date(alert.timestamp), 'HH:mm:ss')}
          </span>
          <span className="text-xs font-mono text-gray-400">{Math.round(alert.confidence * 100)}%</span>
        </div>
        <span
          className={`px-2 py-1 text-xs font-bold rounded-full ${
            alert.status === 'active'
              ? 'bg-danger/20 text-danger'
              : alert.status === 'acknowledged'
                ? 'bg-warning/20 text-warning'
                : 'bg-success/20 text-success'
          }`}
        >
          {alert.status}
        </span>
      </div>
      <div className="flex gap-2">
        {alert.status === 'active' && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="flex-1 px-3 py-2 bg-warning/20 text-warning border border-warning/30 rounded-lg text-sm font-medium hover:bg-warning/30 transition-all"
          >
            Acknowledge
          </button>
        )}
        {alert.status !== 'resolved' && (
          <button
            onClick={() => onResolve(alert.id)}
            className="flex-1 px-3 py-2 bg-success/20 text-success border border-success/30 rounded-lg text-sm font-medium hover:bg-success/30 transition-all"
          >
            Resolve
          </button>
        )}
      </div>
    </motion.div>
  );
}
