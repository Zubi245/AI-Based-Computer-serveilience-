import { motion } from 'framer-motion';

export default function SettingsLoading() {
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

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6 animate-pulse"
        >
          <div className="h-4 w-full bg-navy-800/50 rounded mb-6" />
          <div className="space-y-6">
            <div className="h-4 w-full bg-navy-800 rounded mb-4" />
            <div className="h-2 w-full bg-navy-800/50 rounded animate-pulse mb-2" />
            <div className="h-2 w-1/2 bg-navy-800/50 rounded animate-pulse" />
            <div className="h-4 w-full bg-navy-800/50 rounded animate-pulse mb-4" />
            <div className="h-2 w-full bg-navy-800/50 rounded animate-pulse mb-2" />
            <div className="h-2 w-1/2 bg-navy-800/50 rounded animate-pulse" />
            <div className="h-4 w-full bg-navy-800/50 rounded animate-pulse mb-4" />
            <div className="h-2 w-full bg-navy-800/50 rounded animate-pulse mb-2" />
            <div className="h-2 w-1/3 bg-navy-800/50 rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
