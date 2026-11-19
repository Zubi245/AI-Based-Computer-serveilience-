'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Edit, Trash2, Power, Camera, X } from 'lucide-react';
import { zoneService } from '@/services/zoneService';
import toast from 'react-hot-toast';

const ZONE_TYPES: Record<string, string> = {
  machine_floor: 'Machine Floor',
  restricted_access: 'Restricted Access',
  warehouse: 'Warehouse',
  chemical_storage: 'Chemical Storage',
  office: 'Office',
  entrance: 'Entrance',
};

const RISK_LEVELS = ['low', 'medium', 'high', 'critical'];

export default function ZoneConfiguration() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'machine_floor',
    riskLevel: 'medium',
    area: '',
    capacity: '',
    detectionRules: '',
    status: 'active',
  });

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const data = await zoneService.getAllZones();
      setZones(data);
    } catch (error) {
      console.error('Error loading zones:', error);
      toast.error('Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveZone = async () => {
    if (!formData.name) {
      toast.error('Zone name is required');
      return;
    }

    const zoneData = {
      name: formData.name,
      type: formData.type,
      riskLevel: formData.riskLevel,
      area: formData.area ? parseInt(formData.area) : null,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      detectionRules: formData.detectionRules
        ? formData.detectionRules.split(',').map((r) => r.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editingZone) {
        await zoneService.updateZone(editingZone.id, zoneData);
        toast.success('Zone updated successfully');
      } else {
        await zoneService.addZone(zoneData);
        toast.success('Zone added successfully');
      }
      setShowModal(false);
      setEditingZone(null);
      setFormData({
        name: '',
        type: 'machine_floor',
        riskLevel: 'medium',
        area: '',
        capacity: '',
        detectionRules: '',
        status: 'active',
      });
      loadZones();
    } catch (error) {
      toast.error('Failed to save zone');
    }
  };

  const handleToggleStatus = async (zone: any) => {
    try {
      await zoneService.toggleZoneStatus(zone.id);
      toast.success('Zone status updated');
      loadZones();
    } catch (error) {
      toast.error('Failed to update zone status');
    }
  };

  const handleDelete = async (zone: any) => {
    if (!confirm('Are you sure you want to delete this zone?')) return;

    try {
      await zoneService.deleteZone(zone.id);
      toast.success('Zone deleted');
      loadZones();
    } catch (error) {
      toast.error('Failed to delete zone');
    }
  };

  const openAddModal = () => {
    setEditingZone(null);
    setFormData({
      name: '',
      type: 'machine_floor',
      riskLevel: 'medium',
      area: '',
      capacity: '',
      detectionRules: '',
      status: 'active',
    });
    setShowModal(true);
  };

  const openEditModal = (zone: any) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      type: zone.type || 'machine_floor',
      riskLevel: zone.riskLevel || 'medium',
      area: zone.area ? String(zone.area) : '',
      capacity: zone.capacity ? String(zone.capacity) : '',
      detectionRules: Array.isArray(zone.detectionRules) ? zone.detectionRules.join(', ') : '',
      status: zone.status || 'active',
    });
    setShowModal(true);
  };

  const riskColors: Record<string, string> = {
    critical: 'bg-danger/20 text-danger border border-danger/30',
    high: 'bg-warning/20 text-warning border border-warning/30',
    medium: 'bg-info/20 text-info border border-info/30',
    low: 'bg-success/20 text-success border border-success/30',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-success/20 text-success border border-success/30',
    inactive: 'bg-gray-600/20 text-gray-400 border border-gray-600/30',
    maintenance: 'bg-warning/20 text-warning border border-warning/30',
  };

  const occupancyPercentage = (zone: any) => {
    if (!zone.capacity) return 0;
    return Math.round(((zone.currentOccupancy || 0) / zone.capacity) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Zone Configuration</h1>
          <p className="text-gray-400">Configure factory floor zones, risk levels and detection rules</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Zone
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-navy-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : zones.length === 0 ? (
        <div className="text-center py-12 bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl">
          <p className="text-gray-400">No zones configured yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone: any) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6 hover:border-info/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${zone.color}20`, border: `1px solid ${zone.color}40` }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: zone.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{zone.name}</h3>
                    <p className="text-sm text-gray-400">{ZONE_TYPES[zone.type] || zone.type}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${riskColors[zone.riskLevel] || riskColors.medium}`}>
                  {zone.riskLevel}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${statusColors[zone.status] || statusColors.active}`}>
                  {zone.status}
                </span>
                <span className="text-xs text-gray-400">Area: {zone.area ? `${zone.area} sq ft` : 'N/A'}</span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Occupancy</span>
                  <span className="text-white font-medium">
                    {zone.currentOccupancy || 0}/{zone.capacity || 0} ({occupancyPercentage(zone)}%)
                  </span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      occupancyPercentage(zone) > 80 ? 'bg-danger' : occupancyPercentage(zone) > 60 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${occupancyPercentage(zone)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                <Camera className="w-4 h-4" />
                <span>{zone.cameras?._count?.cameras || 0} cameras assigned</span>
              </div>

              {zone.detectionRules && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {zone.detectionRules.map((rule: string) => (
                    <span
                      key={rule}
                      className="px-2 py-1 text-xs bg-navy-800/50 text-gray-300 border border-navy-700/50 rounded-full"
                    >
                      {rule.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-navy-700/50">
                <button
                  onClick={() => handleToggleStatus(zone)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-navy-800/50 hover:bg-navy-800 text-white border border-navy-700/50 rounded-lg transition-all"
                >
                  <Power className="w-4 h-4" />
                  Toggle Status
                </button>
                <button
                  onClick={() => openEditModal(zone)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(zone)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
                    <MapPin className="w-6 h-6 text-info" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{editingZone ? 'Edit Zone' : 'Add New Zone'}</h2>
                    <p className="text-sm text-gray-400">Configure zone details and detection rules</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-navy-800/50 rounded-lg transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Zone Details</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Zone Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50 focus:ring-2 focus:ring-info/20"
                      placeholder="e.g., Loom Section"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Zone Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
                      >
                        {Object.entries(ZONE_TYPES).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Risk Level</label>
                      <select
                        value={formData.riskLevel}
                        onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                        className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
                      >
                        {RISK_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Area (sq ft)</label>
                      <input
                        type="number"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Detection Rules (comma separated)</label>
                    <input
                      type="text"
                      value={formData.detectionRules}
                      onChange={(e) => setFormData({ ...formData, detectionRules: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info/50"
                      placeholder="e.g., no_mobile_phone, drowsiness_detection, person_detection"
                    />
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
                    onClick={handleSaveZone}
                    className="flex-1 px-4 py-3 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg font-medium transition-all"
                  >
                    {editingZone ? 'Update Zone' : 'Add Zone'}
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
