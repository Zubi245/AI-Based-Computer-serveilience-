import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ icon: Icon, title, value, trend, trendValue, color = 'info', delay = 0 }) => {
  const colorClasses = {
    info: 'from-info/20 to-info/5 border-info/30 text-info shadow-glow-blue',
    success: 'from-success/20 to-success/5 border-success/30 text-success shadow-glow-green',
    danger: 'from-danger/20 to-danger/5 border-danger/30 text-danger shadow-glow-red',
    warning: 'from-warning/20 to-warning/5 border-warning/30 text-warning shadow-glow-amber',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-xl rounded-xl p-6 hover:scale-105 transition-transform duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger" />
              )}
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
    </motion.div>
  );
};

export default MetricCard;
