import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, MapPin, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const CameraModal = ({ isOpen, onClose, onSave, camera = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    zone: '',
    rtspUrl: '',
    status: 'active',
    detectionTypes: {
      smoking: false,
      sleeping: false,
      fire: false,
      mobile: false,
      unethical: false,
    },
  });

  useEffect(() => {
    if (camera) {
      setFormData({
        name: camera.name,
        zone: camera.zone,
        rtspUrl: camera.rtspUrl,
        status: camera.status,
        detectionTypes: camera.detectionTypes || {
          smoking: false,
          sleeping: false,
          fire: false,
          mobile: false,
          unethical: false,
        },
      });
    } else {
      setFormData({
        name: '',
        zone: '',
        rtspUrl: '',
        status: 'active',
        detectionTypes: {
          smoking: false,
          sleeping: false,
          fire: false,
          mobile: false,
          unethical: false,
        },
      });
    }
  }, [camera, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.zone || !formData.rtspUrl) {
      toast.error('Please fill all required fields');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleDetectionToggle = (type) => {
    setFormData({
      ...formData,
      detectionTypes: {
        ...formData.detectionTypes,
        [type]: !formData.detectionTypes[type],
      },
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-2xl shadow-card max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface-card border-b border-navy-700/50 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info/20 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-info" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {camera ? 'Edit Camera' : 'Add New Camera'}
                </h2>
                <p className="text-sm text-gray-400">Configure camera settings and detections</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-navy-800/50 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Camera Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Camera Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Camera Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus:ring-info/20"
                  placeholder="e.g., Camera 01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Zone/Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus:ring-info/20"
                    placeholder="e.g., Production Line A"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  RTSP Stream URL *
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.rtspUrl}
                    onChange={(e) => setFormData({ ...formData, rtspUrl: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus:ring-info/20"
                    placeholder="rtsp://192.168.1.100:554/stream1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50 focus:ring-2 focus:ring-info/20"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Detection Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Detection Configuration</h3>
              <p className="text-sm text-gray-400">Select which detections to enable for this camera</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'smoking', label: 'Smoking Detection', color: 'danger' },
                  { key: 'sleeping', label: 'Sleeping Detection', color: 'warning' },
                  { key: 'fire', label: 'Fire Detection', color: 'danger' },
                  { key: 'mobile', label: 'Mobile Usage Detection', color: 'warning' },
                  { key: 'unethical', label: 'Unethical Activity Detection', color: 'danger' },
                ].map((detection) => (
                  <label
                    key={detection.key}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.detectionTypes[detection.key]
                        ? `bg-${detection.color}/10 border-${detection.color}/30`
                        : 'bg-navy-800/30 border-navy-700/50 hover:bg-navy-800/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.detectionTypes[detection.key]}
                      onChange={() => handleDetectionToggle(detection.key)}
                      className="w-5 h-5 rounded border-navy-700 bg-navy-800 text-info focus:ring-info/20"
                    />
                    <span className="text-sm font-medium text-white">{detection.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-navy-800/50 hover:bg-navy-800 text-white border border-navy-700/50 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg font-medium transition-all"
              >
                {camera ? 'Update Camera' : 'Add Camera'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CameraModal;
