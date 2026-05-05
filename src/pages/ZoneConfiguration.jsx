import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, MapPin } from 'lucide-react';
import { zoneService } from '../services/zoneService';
import toast from 'react-hot-toast';

const ZoneConfiguration = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const riskColors = {
    critical: 'from-danger/30 to-danger/10 border-danger/50 text-danger',
    high: 'from-warning/30 to-warning/10 border-warning/50 text-warning',
    medium: 'from-info/30 to-info/10 border-info/50 text-info',
    low: 'from-success/30 to-success/10 border-success/50 text-success',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Zone Configuration</h1>
          <p className="text-gray-400">Configure factory floor zones and detection rules</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all">
          <Plus className="w-5 h-5" />
          Add Zone
        </button>
      </div>

      {/* Factory Floor Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Factory Floor Layout</h2>
        <div className="relative aspect-video bg-navy-900 rounded-xl overflow-hidden border-2 border-navy-700/50">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Zone Markers */}
          {zones.map((zone, index) => (
            <motion.div
              key={zone.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute"
              style={{
                left: `${(index % 4) * 25 + 10}%`,
                top: `${Math.floor(index / 4) * 33 + 10}%`,
              }}
            >
              <div className="relative group cursor-pointer">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center border-2 backdrop-blur-sm transition-all group-hover:scale-110"
                  style={{ backgroundColor: zone.color + '40', borderColor: zone.color }}
                >
                  <MapPin className="w-8 h-8" style={{ color: zone.color }} />
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-black/90 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-bold text-white">{zone.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-navy-800/50 rounded-xl animate-pulse" />
          ))
        ) : (
          zones.map((zone, index) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-br ${riskColors[zone.riskLevel]} backdrop-blur-xl border rounded-xl p-6 hover:scale-105 transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{zone.name}</h3>
                  <p className="text-sm text-gray-400">{zone.type.replace('_', ' ')}</p>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                  <Edit className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Area</span>
                  <span className="text-white font-medium">{zone.area}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Capacity</span>
                  <span className="text-white font-medium">{zone.capacity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Occupancy</span>
                  <span className="text-white font-medium">{zone.currentOccupancy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cameras</span>
                  <span className="text-white font-medium">{zone.cameras.length}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-2">Active Rules</p>
                <div className="flex flex-wrap gap-2">
                  {zone.rules.map((rule) => (
                    <span
                      key={rule}
                      className="px-2 py-1 text-xs font-medium bg-white/10 rounded-full text-white"
                    >
                      {rule.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ZoneConfiguration;
