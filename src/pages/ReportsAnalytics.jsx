import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { reportService } from '../services/reportService';
import toast from 'react-hot-toast';

const ReportsAnalytics = () => {
  const [violationData, setViolationData] = useState([]);
  const [complianceData, setComplianceData] = useState([]);
  const [zoneRiskData, setZoneRiskData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [violations, compliance, zoneRisk] = await Promise.all([
        reportService.getViolationsByCategory(),
        reportService.getWeeklyComplianceTrend(),
        reportService.getZoneRiskComparison(),
      ]);
      setViolationData(violations);
      setComplianceData(compliance);
      setZoneRiskData(zoneRisk);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const toastId = toast.loading('Generating PDF report...');
    try {
      await reportService.exportPDF('analytics');
      toast.success('PDF report generated', { id: toastId });
    } catch (error) {
      toast.error('Failed to generate PDF', { id: toastId });
    }
  };

  const handleExportCSV = async () => {
    const toastId = toast.loading('Generating CSV report...');
    try {
      await reportService.exportCSV('analytics');
      toast.success('CSV report generated', { id: toastId });
    } catch (error) {
      toast.error('Failed to generate CSV', { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">Comprehensive insights and data visualization</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger border border-danger/30 rounded-lg transition-all"
          >
            <FileText className="w-5 h-5" />
            Export PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-success/20 hover:bg-success/30 text-success border border-success/30 rounded-lg transition-all"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Violations by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Violations by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={violationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {violationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Weekly Compliance Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Weekly Compliance Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={complianceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f1729',
                border: '1px solid #1e3a5f',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="violations" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} />
            <Line type="monotone" dataKey="compliance" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Zone Risk Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Zone Risk Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={zoneRiskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="zone" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f1729',
                border: '1px solid #1e3a5f',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="risk" fill="#f59e0b" />
            <Bar dataKey="violations" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default ReportsAnalytics;
