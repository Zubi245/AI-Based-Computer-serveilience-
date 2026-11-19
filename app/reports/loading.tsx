import { motion } from 'framer-motion';

export default function ReportsLoading() {
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
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6 animate-pulse"
          >
            <div className="h-8 w-24 bg-navy-800 rounded mb-6" />
            <div className="h-64 bg-navy-800/50 rounded-xl" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6 animate-pulse"
          >
            <div className="h-8 w-24 bg-navy-800 rounded mb-6" />
            <div className="h-64 bg-navy-800/50 rounded-xl" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
