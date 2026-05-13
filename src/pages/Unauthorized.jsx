import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-surface-card backdrop-blur-xl border border-danger/30 rounded-2xl p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 bg-danger/20 rounded-full flex items-center justify-center shadow-glow-red"
          >
            <ShieldAlert className="w-12 h-12 text-danger" />
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
          <p className="text-gray-400 mb-8">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-navy-800/50 hover:bg-navy-800 text-white border border-navy-700/50 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all"
            >
              <Home className="w-5 h-5" />
              Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
