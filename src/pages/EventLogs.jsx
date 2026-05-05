import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { alertService } from '../services/alertService';
import { formatDistanceToNow } from 'date-fns';

const EventLogs = () => {
  const [events, setEvents] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    severity: '',
    camera: '',
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
    } finally {
      setLoading(false);
    }
  };

  const severityColors = {
    critical: 'bg-danger/20 text-danger border-danger/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    info: 'bg-info/20 text-info border-info/30',
  };

  const statusColors = {
    active: 'bg-danger/20 text-danger border-danger/30',
    acknowledged: 'bg-warning/20 text-warning border-warning/30',
    resolved: 'bg-success/20 text-success border-success/30',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Event Logs</h1>
          <p className="text-gray-400">Comprehensive history of all detection events</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all">
          <Download className="w-5 h-5" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-white">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="px-4 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="px-4 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-white focus:outline-none focus:border-info/50"
          />
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
          <button
            onClick={() => setFilters({ startDate: '', endDate: '', severity: '', camera: '' })}
            className="px-4 py-2 bg-navy-800/50 hover:bg-navy-800 border border-navy-700/50 rounded-lg text-white transition-all"
          >
            Clear Filters
          </button>
        </div>
      </motion.div>

      {/* Event Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-800/50 border-b border-navy-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Event ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Camera</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Violation</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Confidence</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Severity</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300">Action</th>
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
                events.map((event) => (
                  <>
                    <tr
                      key={event.id}
                      className="hover:bg-navy-800/30 transition-colors cursor-pointer"
                      onClick={() => setExpandedRow(expandedRow === event.id ? null : event.id)}
                    >
                      <td className="px-6 py-4 text-sm font-mono text-white">{event.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{event.camera}</td>
                      <td className="px-6 py-4 text-sm text-white">{event.violationLabel}</td>
                      <td className="px-6 py-4 text-sm text-white">{(event.confidence * 100).toFixed(0)}%</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${severityColors[event.severity]}`}>
                          {event.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${statusColors[event.status]}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {expandedRow === event.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </td>
                    </tr>
                    {expandedRow === event.id && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-navy-800/20">
                          <div className="space-y-2">
                            <p className="text-sm text-gray-400">
                              <span className="font-bold text-white">Zone:</span> {event.zone}
                            </p>
                            {event.notes && (
                              <p className="text-sm text-gray-400">
                                <span className="font-bold text-white">Notes:</span> {event.notes}
                              </p>
                            )}
                            {event.acknowledgedBy && (
                              <p className="text-sm text-gray-400">
                                <span className="font-bold text-white">Acknowledged by:</span> {event.acknowledgedBy}
                              </p>
                            )}
                            {event.resolvedBy && (
                              <p className="text-sm text-gray-400">
                                <span className="font-bold text-white">Resolved by:</span> {event.resolvedBy}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default EventLogs;
