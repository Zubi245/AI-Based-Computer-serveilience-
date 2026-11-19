'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    confidenceThreshold: 0.85,
    alertCooldown: 30,
    frameInterval: 5,
    retentionDays: 90,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const handleSave = async () => {
    localStorage.setItem('texvision_settings', JSON.stringify(settings))
    toast.success('Settings saved successfully')
  };

  const handleReset = () => {
    setSettings({
      confidenceThreshold: 0.85,
      alertCooldown: 30,
      frameInterval: 5,
      retentionDays: 90,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    })
    toast('Settings reset to defaults')
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-gray-400">Configure detection and notification preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-navy-800/50 hover:bg-navy-800 text-white border border-navy-700/50 rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Detection & Notification Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              AI Confidence Threshold: {Math.round(settings.confidenceThreshold * 100)}%
            </label>
            <input
              type="range"
              min={50}
              max={100}
              value={Math.round(settings.confidenceThreshold * 100)}
              onChange={(e) => setSettings({ ...settings, confidenceThreshold: Number(e.target.value) / 100 })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Alert Cooldown: {settings.alertCooldown}s</label>
            <input
              type="range"
              min={10}
              max={120}
              value={settings.alertCooldown}
              onChange={(e) => setSettings({ ...settings, alertCooldown: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Frame Extraction Interval: {settings.frameInterval}s</label>
            <input
              type="range"
              min={1}
              max={10}
              value={settings.frameInterval}
              onChange={(e) => setSettings({ ...settings, frameInterval: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Data Retention: {settings.retentionDays} days</label>
            <input
              type="number"
              min={1}
              max={365}
              value={settings.retentionDays}
              onChange={(e) => setSettings({ ...settings, retentionDays: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-navy-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-sm text-gray-400">Send alerts via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between p-4 bg-navy-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-400">Send critical alerts via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between p-4 bg-navy-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-sm text-gray-400">In-app real-time alerts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
              className="w-5 h-5"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
