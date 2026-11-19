'use client';

import { motion } from 'framer-motion';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color?: 'info' | 'success' | 'warning' | 'danger';
  trend?: 'up' | 'down';
  trendValue?: string;
  delay?: number;
}

const colorClasses: Record<string, string> = {
  info: 'bg-info/20 text-info border border-info/30',
  success: 'bg-success/20 text-success border border-success/30',
  warning: 'bg-warning/20 text-warning border border-warning/30',
  danger: 'bg-danger/20 text-danger border border-danger/30',
};

export default function MetricCard({
  icon,
  title,
  value,
  color = 'info',
  trend,
  trendValue,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br rounded-xl p-6 border ${colorClasses[color]}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color === 'info' ? 'bg-info/10' : color === 'success' ? 'bg-success/10' : color === 'warning' ? 'bg-warning/10' : 'bg-danger/10'}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </motion.div>
  );
}
