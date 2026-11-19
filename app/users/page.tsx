'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Edit, Trash2, Power, X } from 'lucide-react';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';

const ROLES = ['administrator', 'supervisor', 'viewer'];

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer',
    status: 'active',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    const userData: any = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
    };

    if (formData.password) {
      userData.password = formData.password;
    }

    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, userData);
        toast.success('User updated successfully');
      } else {
        await userService.addUser(userData);
        toast.success('User added successfully');
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'viewer', status: 'active' });
      loadUsers();
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      await userService.toggleUserStatus(user.id);
      toast.success('User status updated');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async (user: any) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.deleteUser(user.id);
      toast.success('User deleted');
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'viewer', status: 'active' });
    setShowModal(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    });
    setShowModal(true);
  };

  const stats = {
    total: users.length,
    administrators: users.filter((u) => u.role === 'administrator').length,
    supervisors: users.filter((u) => u.role === 'supervisor').length,
    viewers: users.filter((u) => u.role === 'viewer').length,
    active: users.filter((u) => u.status === 'active').length,
  };

  const roleColors: Record<string, string> = {
    administrator: 'bg-danger/20 text-danger border border-danger/30',
    supervisor: 'bg-warning/20 text-warning border border-warning/30',
    viewer: 'bg-info/20 text-info border border-info/30',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-success/20 text-success border border-success/30',
    inactive: 'bg-gray-600/20 text-gray-400 border border-gray-600/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage system users, roles and permissions</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-info/20 to-info/5 border border-info/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-danger/20 to-danger/5 border border-danger/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Administrators</p>
          <p className="text-3xl font-bold text-danger">{stats.administrators}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Supervisors</p>
          <p className="text-3xl font-bold text-warning">{stats.supervisors}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Active Users</p>
          <p className="text-3xl font-bold text-success">{stats.active}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-800/50 border-b border-navy-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Last Login</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-8 bg-navy-800/50 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-navy-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-info" />
                        </div>
                        <span className="text-sm font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${roleColors[user.role] || roleColors.viewer}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${statusColors[user.status] || statusColors.active}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-info/20 text-info rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className="p-2 hover:bg-warning/20 text-warning rounded-lg transition-all"
                          title="Toggle Status"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 hover:bg-danger/20 text-danger rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-2xl shadow-card max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-surface-card border-b border-navy-700/50 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-info/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-info" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                    <p className="text-sm text-gray-400">Manage user account details</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-navy-800/50 rounded-lg transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">User Details</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus:ring-info/20"
                      placeholder="e.g., John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus:ring-info/20"
                      placeholder="e.g., john@texvision.ai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password {editingUser ? '(leave blank to keep current)' : '*'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus:ring-info/20"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-navy-800/50 hover:bg-navy-800 text-white border border-navy-700/50 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveUser}
                    className="flex-1 px-4 py-3 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg font-medium transition-all"
                  >
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
