'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CamerasError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Cameras Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 p-4">
      <div className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-2xl p-8 max-w-md w-full shadow-card">
        <div className="w-12 h-12 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-red">
          <AlertTriangle className="w-6 h-6 text-danger" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Camera Management Error</h2>
        <p className="text-gray-400 text-center mb-6">
          Something went wrong while loading cameras.
        </p>
        <button
          onClick={reset}
          className="w-full px-4 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg font-medium transition-all"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
        <div className="mt-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400">
            <span>←</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
