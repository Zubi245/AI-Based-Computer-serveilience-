import {
  violationsByCategory,
  weeklyComplianceTrend,
  zoneRiskComparison,
  cameraActivityHeatmap,
  alertResolutionTime,
  systemHealthMetrics,
} from '../data/mockAnalytics';

export const reportService = {
  getViolationsByCategory: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return violationsByCategory;
  },

  getWeeklyComplianceTrend: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return weeklyComplianceTrend;
  },

  getZoneRiskComparison: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return zoneRiskComparison;
  },

  getCameraActivityHeatmap: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return cameraActivityHeatmap;
  },

  getAlertResolutionTime: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return alertResolutionTime;
  },

  getSystemHealthMetrics: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return systemHealthMetrics;
  },

  exportPDF: async (reportType) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Exporting ${reportType} as PDF...`);
    return true;
  },

  exportCSV: async (reportType) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Exporting ${reportType} as CSV...`);
    return true;
  },
};
