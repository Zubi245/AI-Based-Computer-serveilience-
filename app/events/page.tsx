'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Filter } from 'lucide-react';
import { alertService } from '@/services/alertService';
import toast from 'react-hot-toast';

export default function EventLogs() {
  const [events, setEvents] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    severity: '',
    camera: '',
    zone: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      const data = await alertService.getAllAlerts(filters);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const severityColor: Record<string, string> = {
    critical: 'bg-danger/20 text-danger border border-danger/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    info: 'bg-info/20 text-info border border-info/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Event Logs</h1>
          <p className="text-gray-400">Comprehensive event history and audit trail</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-white">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="px-4 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <select
            value={filters.camera}
            onChange={(e) => setFilters({ ...filters, camera: e.target.value })}
            className="px-4 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
          >
            <option value="">All Cameras</option>
            <option value="CAM-001">CAM-001</option>
            <option value="CAM-002">CAM-002</option>
            <option value="CAM-003">CAM-003</option>
            <option value="CAM-004">CAM-004</option>
            <option value="CAM-005">CAM-005</option>
          </select>
          <button
            onClick={() => setFilters({ severity: '', camera: '', zone: '' })}
            className="px-4 py-2 bg-navy-800/50 hover:bg-navy-800 border border-navy-700/50 rounded-lg text-white transition-all"
          >
            Clear Filters
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-800/50 border-b border-navy-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Event ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Camera</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Zone</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Violation</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Severity</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-6 py-4">
                      <div className="h-8 bg-navy-800/50 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((event: any) => (
                  <tr key={event.id} className="hover:bg-navy-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-white">{event.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{event.camera}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{event.zone}</td>
                    <td className="px-6 py-4 text-sm text-white">{event.violationLabel}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${severityColor[event.severity] || severityColor.info}`}>
                        {event.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        event.status === 'active' ? 'bg-danger/20 text-danger' :
                        event.status === 'acknowledged' ? 'bg-warning/20 text-warning' :
                        'bg-success/20 text-success'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
