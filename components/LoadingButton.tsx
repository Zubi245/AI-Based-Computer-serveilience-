'use client';

import { motion } from 'framer-motion';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export default function LoadingButton({
  loading = false,
  children,
  className = '',
  ...props
}: LoadingButtonProps) {
  return (
    <button
      disabled={loading}
      className={`
        flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed
        ${loading ? 'bg-gray-600/20 text-gray-400 border-gray-600/30 cursor-not-allowed' : 'bg-info/20 hover:bg-info/30 text-info border border-info/30 cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
