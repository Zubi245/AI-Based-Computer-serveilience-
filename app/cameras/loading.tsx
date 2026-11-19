import { motion } from 'framer-motion';

export default function CamerasLoading() {
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-navy-800/50 rounded-xl p-6 animate-pulse border border-navy-700/50"
          >
            <div className="h-8 w-24 bg-navy-800 rounded mb-4" />
            <div className="h-4 w-full bg-navy-800 rounded mb-2" />
            <div className="h-3 w-3/4 bg-navy-800 rounded" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-800/50 border-b border-navy-700/50">
              <tr>
                {[...Array(7)].map((_, i) => (
                  <th key={i} className="px-6 py-4">
                    <div className="h-4 w-24 bg-navy-800 rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="hover:bg-navy-800/30 transition-colors">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-navy-800/50 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
