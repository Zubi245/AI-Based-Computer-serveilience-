import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Power } from 'lucide-react';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'administrator';

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

  const handleAddUser = async (userData) => {
    try {
      const newUser = await userService.addUser(userData);
      setUsers(prev => [...prev, newUser]);
      toast.success('User added successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
      throw new Error(error.message || 'Failed to add user');
    }
  };

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      toast.error('Only administrators can add users');
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    if (!isAdmin) {
      toast.error('Only administrators can edit users');
      return;
    }
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const updatedUser = await userService.updateUser(userId, userData);
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error(error.message || 'Failed to update user');
    }
  };

  const handleToggleStatus = async (id) => {
    if (!isAdmin) {
      toast.error('Only administrators can change user status');
      return;
    }
    
    try {
      await userService.toggleUserStatus(id);
      setUsers(prev => prev.map(u => 
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      ));
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast.error('Only administrators can delete users');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const roleColors = {
    administrator: 'bg-danger/20 text-danger border-danger/30',
    supervisor: 'bg-warning/20 text-warning border-warning/30',
    viewer: 'bg-info/20 text-info border-info/30',
  };

  const statusColors = {
    active: 'bg-success/20 text-success border-success/30',
    inactive: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage system users and permissions</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          disabled={!isAdmin}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
            isAdmin 
              ? 'bg-info/20 hover:bg-info/30 text-info border-info/30 cursor-pointer' 
              : 'bg-gray-600/20 text-gray-500 border-gray-600/30 cursor-not-allowed opacity-50'
          }`}
          title={!isAdmin ? 'Only administrators can add users' : 'Add new user'}
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-info/20 to-info/5 border border-info/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-danger/20 to-danger/5 border border-danger/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Administrators</p>
          <p className="text-3xl font-bold text-danger">
            {users.filter(u => u.role === 'administrator').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Supervisors</p>
          <p className="text-3xl font-bold text-warning">
            {users.filter(u => u.role === 'supervisor').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Active Users</p>
          <p className="text-3xl font-bold text-success">
            {users.filter(u => u.status === 'active').length}
          </p>
        </motion.div>
      </div>

      {/* Users Table */}
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
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">User ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Created Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Last Login</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="8" className="px-6 py-4">
                      <div className="h-8 bg-navy-800/50 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-navy-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-white">{user.id}</td>
                    <td className="px-6 py-4 text-sm text-white">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${statusColors[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={!isAdmin}
                          className={`p-2 rounded-lg transition-all ${
                            isAdmin 
                              ? 'hover:bg-warning/20 text-warning cursor-pointer' 
                              : 'text-gray-600 cursor-not-allowed opacity-50'
                          }`}
                          title={isAdmin ? 'Toggle Status' : 'Admin only'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(user)}
                          disabled={!isAdmin}
                          className={`p-2 rounded-lg transition-all ${
                            isAdmin 
                              ? 'hover:bg-info/20 text-info cursor-pointer' 
                              : 'text-gray-600 cursor-not-allowed opacity-50'
                          }`}
                          title={isAdmin ? 'Edit User' : 'Admin only'}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={!isAdmin}
                          className={`p-2 rounded-lg transition-all ${
                            isAdmin 
                              ? 'hover:bg-danger/20 text-danger cursor-pointer' 
                              : 'text-gray-600 cursor-not-allowed opacity-50'
                          }`}
                          title={isAdmin ? 'Delete User' : 'Admin only'}
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

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleAddUser}
        existingEmails={users.map(u => u.email.toLowerCase())}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onUserUpdated={handleUpdateUser}
        user={selectedUser}
        existingEmails={users.map(u => u.email.toLowerCase())}
      />
    </div>
  );
};

export default UserManagement;
