import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Power, TestTube } from 'lucide-react';
import { cameraService } from '../services/cameraService';
import CameraModal from '../components/CameraModal';
import toast from 'react-hot-toast';

const CameraManagement = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      const data = await cameraService.getAllCameras();
      setCameras(data);
    } catch (error) {
      console.error('Error loading cameras:', error);
      toast.error('Failed to load cameras');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCamera = async (cameraData) => {
    try {
      if (editingCamera) {
        await cameraService.updateCamera(editingCamera.id, cameraData);
        toast.success('Camera updated successfully');
      } else {
        await cameraService.addCamera(cameraData);
        toast.success('Camera added successfully');
      }
      loadCameras();
      setEditingCamera(null);
    } catch (error) {
      toast.error('Failed to save camera');
    }
  };

  const handleEdit = (camera) => {
    setEditingCamera(camera);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingCamera(null);
    setShowModal(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      await cameraService.toggleStatus(id);
      toast.success('Camera status updated');
      loadCameras();
    } catch (error) {
      toast.error('Failed to update camera status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this camera?')) return;
    
    try {
      await cameraService.deleteCamera(id);
      toast.success('Camera deleted');
      loadCameras();
    } catch (error) {
      toast.error('Failed to delete camera');
    }
  };

  const handleTestConnection = async (rtspUrl) => {
    const toastId = toast.loading('Testing connection...');
    try {
      const success = await cameraService.testConnection(rtspUrl);
      if (success) {
        toast.success('Connection successful', { id: toastId });
      } else {
        toast.error('Connection failed', { id: toastId });
      }
    } catch (error) {
      toast.error('Connection test failed', { id: toastId });
    }
  };

  const statusColors = {
    active: 'bg-success/20 text-success border-success/30',
    inactive: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
    maintenance: 'bg-warning/20 text-warning border-warning/30',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Camera Management</h1>
          <p className="text-gray-400">Configure and monitor surveillance cameras</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Camera
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-info/20 to-info/5 border border-info/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Total Cameras</p>
          <p className="text-3xl font-bold text-white">{cameras.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Active</p>
          <p className="text-3xl font-bold text-success">
            {cameras.filter(c => c.status === 'active').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Maintenance</p>
          <p className="text-3xl font-bold text-warning">
            {cameras.filter(c => c.status === 'maintenance').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-danger/20 to-danger/5 border border-danger/30 rounded-xl p-6"
        >
          <p className="text-sm text-gray-400 mb-1">Inactive</p>
          <p className="text-3xl font-bold text-danger">
            {cameras.filter(c => c.status === 'inactive').length}
          </p>
        </motion.div>
      </div>

      {/* Camera Table */}
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
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Camera ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Zone</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">RTSP URL</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Health</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="7" className="px-6 py-4">
                      <div className="h-8 bg-navy-800/50 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : (
                cameras.map((camera) => (
                  <tr key={camera.id} className="hover:bg-navy-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-white">{camera.id}</td>
                    <td className="px-6 py-4 text-sm text-white">{camera.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{camera.zone}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-400 truncate max-w-xs">
                      {camera.rtspUrl}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${statusColors[camera.status]}`}>
                        {camera.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${camera.health > 80 ? 'bg-success' : camera.health > 50 ? 'bg-warning' : 'bg-danger'}`}
                            style={{ width: `${camera.health}%` }}
                          />
                        </div>
                        <span className="text-sm text-white">{camera.health}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTestConnection(camera.rtspUrl)}
                          className="p-2 hover:bg-info/20 text-info rounded-lg transition-all"
                          title="Test Connection"
                        >
                          <TestTube className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(camera.id)}
                          className="p-2 hover:bg-warning/20 text-warning rounded-lg transition-all"
                          title="Toggle Status"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(camera)}
                          className="p-2 hover:bg-info/20 text-info rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(camera.id)}
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

      {/* Camera Modal */}
      <CameraModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCamera(null);
        }}
        onSave={handleSaveCamera}
        camera={editingCamera}
      />
    </div>
  );
};

export default CameraManagement;
