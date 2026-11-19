'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from 'recharts';
import { reportService } from '@/services/reportService';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#8b5cf6', '#ec4899'];

export default function ReportsAnalytics() {
  const [violationsData, setViolationsData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [zoneData, setZoneData] = useState<any[]>([]);
  const [cameraData, setCameraData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [violations, weekly, zoneRisk, cameraActivity] = await Promise.all([
        reportService.getViolationsByCategory(),
        reportService.getWeeklyComplianceTrend(),
        reportService.getZoneRiskComparison(),
        reportService.getCameraActivityHeatmap(),
      ]);
      setViolationsData(violations);
      setWeeklyData(weekly);
      setZoneData(zoneRisk);
      setCameraData(cameraActivity);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = (type: string) => {
    toast.loading('Generating PDF report...');
    reportService.exportPDF(type).then(() => {
      toast.success('PDF report generated');
    }).catch(() => {
      toast.error('Failed to generate PDF');
    });
  };

  const handleExportCSV = (type: string) => {
    toast.loading('Generating CSV report...');
    reportService.exportCSV(type).then(() => {
      toast.success('CSV report generated');
    }).catch(() => {
      toast.error('Failed to generate CSV');
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-32 bg-navy-800/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">Comprehensive analytics and violation insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExportPDF('alerts')}
            className="flex items-center gap-2 px-4 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={() => handleExportCSV('alerts')}
            className="flex items-center gap-2 px-4 py-2 bg-info/20 hover:bg-info/30 text-info border border-info/30 rounded-lg transition-all"
          >
            <FileText className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Violations by Category</h2>
          <div className="h-64">
            <RechartsPieChart width={400} height={300}>
              <Pie
                data={violationsData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
                label={({ name, value, percent }: any) => (
                  <text
                    x={0}
                    y={0}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize={12}
                  >
                    {name}: {value}
                  </text>
                )}
              />
            </RechartsPieChart>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Weekly Compliance Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Zone Risk Comparison</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={zoneData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="zone" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="alerts" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cameras" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Camera Activity</h2>
          <div className="h-64 overflow-y-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-navy-800/50">
                  <th className="px-4 py-3 text-sm font-bold text-gray-300">Camera</th>
                  <th className="px-4 py-3 text-sm font-bold text-gray-300">Status</th>
                  <th className="px-4 py-3 text-sm font-bold text-gray-300">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {cameraData.map((cam: any, i: number) => (
                  <tr key={i} className="border-b border-navy-700/50 hover:bg-navy-800/20">
                    <td className="px-4 py-3 text-sm text-white">{cam.camera}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        cam.status === 'active' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                      }`}>
                        {cam.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{cam.alerts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
