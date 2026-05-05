import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    confidenceThreshold: 0.85,
    alertCooldown: 30,
    frameInterval: 5,
    retentionDays: 90,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-gray-400">Configure detection and notification preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-success/20 hover:bg-success/30 text-success border border-success/30 rounded-lg transition-all"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      {/* Detection Thresholds */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Detection Thresholds</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Confidence Threshold</label>
              <span className="text-sm font-bold text-white">{(settings.confidenceThreshold * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={settings.confidenceThreshold}
              onChange={(e) => setSettings({ ...settings, confidenceThreshold: parseFloat(e.target.value) })}
              className="w-full h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-info"
            />
            <p className="text-xs text-gray-400 mt-2">Minimum confidence level for triggering alerts</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Alert Cooldown (seconds)</label>
              <span className="text-sm font-bold text-white">{settings.alertCooldown}s</span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="10"
              value={settings.alertCooldown}
              onChange={(e) => setSettings({ ...settings, alertCooldown: parseInt(e.target.value) })}
              className="w-full h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-warning"
            />
            <p className="text-xs text-gray-400 mt-2">Time between repeated alerts for the same violation</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Frame Extraction Interval (seconds)</label>
              <span className="text-sm font-bold text-white">{settings.frameInterval}s</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={settings.frameInterval}
              onChange={(e) => setSettings({ ...settings, frameInterval: parseInt(e.target.value) })}
              className="w-full h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-success"
            />
            <p className="text-xs text-gray-400 mt-2">How often to extract frames for AI analysis</p>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Notification Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-navy-800/30 rounded-lg cursor-pointer hover:bg-navy-800/50 transition-all">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-sm text-gray-400">Receive alerts via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="w-5 h-5 rounded border-navy-700 bg-navy-800 text-info focus:ring-info/20"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-navy-800/30 rounded-lg cursor-pointer hover:bg-navy-800/50 transition-all">
            <div>
              <p className="text-white font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-400">Receive alerts via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
              className="w-5 h-5 rounded border-navy-700 bg-navy-800 text-info focus:ring-info/20"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-navy-800/30 rounded-lg cursor-pointer hover:bg-navy-800/50 transition-all">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-sm text-gray-400">Receive browser push notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
              className="w-5 h-5 rounded border-navy-700 bg-navy-800 text-info focus:ring-info/20"
            />
          </label>
        </div>
      </motion.div>

      {/* Retention Policy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Data Retention Policy</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Retention Period (days)
          </label>
          <input
            type="number"
            value={settings.retentionDays}
            onChange={(e) => setSettings({ ...settings, retentionDays: parseInt(e.target.value) })}
            className="w-full px-4 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
          />
          <p className="text-xs text-gray-400 mt-2">Number of days to retain alert data and recordings</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
