import { motion } from 'framer-motion';

export default function ZonesLoading() {
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
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="bg-navy-800/50 rounded-xl p-6 animate-pulse border border-navy-700/50"
          >
            <div className="h-8 w-24 bg-navy-800 rounded mb-4" />
            <div className="h-4 w-full bg-navy-800 rounded mb-2" />
            <div className="h-3 w-1/2 bg-navy-800 rounded" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
