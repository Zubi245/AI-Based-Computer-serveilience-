import { motion } from 'framer-motion';

export default function EventsLoading() {
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
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <div className="w-24 h-6 bg-navy-800/50 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-4 p-3 bg-navy-800/30 rounded-lg animate-pulse"
            >
              <div className="w-8 h-8 bg-navy-800 rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-navy-800 rounded mb-2" />
                <div className="h-3 w-1/2 bg-navy-800 rounded" />
              </div>
              <div className="h-6 w-20 bg-navy-800 rounded" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
