import { motion } from 'framer-motion';

export default function LiveMonitoringLoading() {
  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="w-48 h-8 bg-navy-800/50 rounded animate-pulse" />
        <div className="w-32 h-4 bg-navy-800/50 rounded animate-pulse" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-3 p-4 bg-danger/10 border border-danger/30 rounded-xl"
      >
        <div className="w-3 h-3 bg-danger rounded-full animate-pulse shadow-glow-red" />
        <div className="w-48 h-6 bg-navy-800/50 rounded animate-pulse" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            className="aspect-video bg-navy-800/50 rounded-xl animate-pulse"
          />
        ))}
      </motion.div>
    </div>
  );
}
