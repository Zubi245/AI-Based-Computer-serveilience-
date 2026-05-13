import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import AlertsPage from './pages/AlertsPage';
import CameraManagement from './pages/CameraManagement';
import ZoneConfiguration from './pages/ZoneConfiguration';
import EventLogs from './pages/EventLogs';
import ReportsAnalytics from './pages/ReportsAnalytics';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/authService';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0f1729',
            color: '#fff',
            border: '1px solid #1e3a5f',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* All authenticated users */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="live-monitoring" element={<LiveMonitoring />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="event-logs" element={<EventLogs />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          
          {/* Admin & Supervisor only */}
          <Route path="cameras" element={
            <ProtectedRoute allowedRoles={['administrator', 'supervisor']}>
              <CameraManagement />
            </ProtectedRoute>
          } />
          <Route path="zones" element={
            <ProtectedRoute allowedRoles={['administrator', 'supervisor']}>
              <ZoneConfiguration />
            </ProtectedRoute>
          } />
          
          {/* Admin only */}
          <Route path="users" element={
            <ProtectedRoute allowedRoles={['administrator']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute allowedRoles={['administrator']}>
              <Settings />
            </ProtectedRoute>
          } />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
