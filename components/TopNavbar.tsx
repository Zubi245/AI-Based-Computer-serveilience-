'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, Menu } from 'lucide-react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function TopNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const user = authService.getCurrentUser();
  const router = useRouter();

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 bg-navy-900/80 backdrop-blur-md border-b border-navy-700/50"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-navy-800/50 text-white hover:bg-navy-800 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-400">System Online</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-info/50 focus:ring-1 focus-ring-info/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <span className="text-white font-medium">{currentTime}</span>
            </div>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg transition-all border border-danger/30"
            >
              <User className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
