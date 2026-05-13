import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Video,
  AlertTriangle,
  Camera,
  MapPin,
  FileText,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import { authService } from '../services/authService';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['administrator', 'supervisor', 'viewer'] },
    { icon: Video, label: 'Live Monitoring', path: '/live-monitoring', roles: ['administrator', 'supervisor', 'viewer'] },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts', roles: ['administrator', 'supervisor', 'viewer'] },
    { icon: Camera, label: 'Camera Management', path: '/cameras', roles: ['administrator', 'supervisor'] },
    { icon: MapPin, label: 'Zone Configuration', path: '/zones', roles: ['administrator', 'supervisor'] },
    { icon: FileText, label: 'Event Logs', path: '/event-logs', roles: ['administrator', 'supervisor', 'viewer'] },
    { icon: BarChart3, label: 'Reports & Analytics', path: '/reports', roles: ['administrator', 'supervisor', 'viewer'] },
    { icon: Users, label: 'User Management', path: '/users', roles: ['administrator'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['administrator'] },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-navy-900 to-navy-950 border-r border-navy-700/50 backdrop-blur-xl z-40"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-navy-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-danger to-danger-dark rounded-lg flex items-center justify-center shadow-glow-red">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TexVision AI</h1>
              <p className="text-xs text-gray-400">Surveillance System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-danger/20 text-danger border border-danger/30 shadow-glow-red'
                      : 'text-gray-400 hover:bg-navy-800/50 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-5 h-5 ${isActive ? 'animate-pulse-slow' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-navy-700/50">
          <div className="mb-3 p-3 bg-navy-800/50 rounded-lg">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-info/20 text-info rounded">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg transition-all duration-200 border border-danger/30"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
