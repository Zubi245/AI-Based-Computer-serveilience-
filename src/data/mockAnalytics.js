export const violationsByCategory = [
  { name: 'Mobile Phone', value: 145, color: '#ef4444' },
  { name: 'Smoking', value: 89, color: '#dc2626' },
  { name: 'Drowsiness', value: 67, color: '#f59e0b' },
  { name: 'Unauthorized Entry', value: 52, color: '#b91c1c' },
  { name: 'Fire Extinguisher', value: 34, color: '#f97316' },
];

export const weeklyComplianceTrend = [
  { day: 'Mon', violations: 45, resolved: 42, compliance: 93 },
  { day: 'Tue', violations: 52, resolved: 48, compliance: 92 },
  { day: 'Wed', violations: 38, resolved: 36, compliance: 95 },
  { day: 'Thu', violations: 61, resolved: 55, compliance: 90 },
  { day: 'Fri', violations: 48, resolved: 46, compliance: 96 },
  { day: 'Sat', violations: 29, resolved: 28, compliance: 97 },
  { day: 'Sun', violations: 24, resolved: 24, compliance: 100 },
];

export const zoneRiskComparison = [
  { zone: 'Loom Section', risk: 78, violations: 45 },
  { zone: 'Chemical Storage', risk: 92, violations: 28 },
  { zone: 'Production Line', risk: 65, violations: 52 },
  { zone: 'Restricted Zone', risk: 88, violations: 31 },
  { zone: 'Warehouse', risk: 42, violations: 18 },
  { zone: 'Dyeing Unit', risk: 71, violations: 39 },
];

export const cameraActivityHeatmap = [
  { hour: '00:00', CAM01: 2, CAM02: 1, CAM03: 0, CAM04: 1, CAM05: 3, CAM06: 0 },
  { hour: '02:00', CAM01: 1, CAM02: 0, CAM03: 1, CAM04: 0, CAM05: 2, CAM06: 0 },
  { hour: '04:00', CAM01: 0, CAM02: 0, CAM03: 0, CAM04: 0, CAM05: 1, CAM06: 0 },
  { hour: '06:00', CAM01: 5, CAM02: 3, CAM03: 2, CAM04: 2, CAM05: 6, CAM06: 1 },
  { hour: '08:00', CAM01: 12, CAM02: 8, CAM03: 5, CAM04: 6, CAM05: 15, CAM06: 3 },
  { hour: '10:00', CAM01: 18, CAM02: 12, CAM03: 8, CAM04: 9, CAM05: 22, CAM06: 5 },
  { hour: '12:00', CAM01: 15, CAM02: 10, CAM03: 7, CAM04: 8, CAM05: 19, CAM06: 4 },
  { hour: '14:00', CAM01: 20, CAM02: 14, CAM03: 9, CAM04: 11, CAM05: 25, CAM06: 6 },
  { hour: '16:00', CAM01: 16, CAM02: 11, CAM03: 6, CAM04: 9, CAM05: 20, CAM06: 5 },
  { hour: '18:00', CAM01: 10, CAM02: 7, CAM03: 4, CAM04: 5, CAM05: 12, CAM06: 3 },
  { hour: '20:00', CAM01: 4, CAM02: 2, CAM03: 1, CAM04: 2, CAM05: 5, CAM06: 1 },
  { hour: '22:00', CAM01: 2, CAM02: 1, CAM03: 0, CAM04: 1, CAM05: 3, CAM06: 0 },
];

export const alertResolutionTime = [
  { category: 'Mobile Phone', avgTime: 8.5, target: 10 },
  { category: 'Smoking', avgTime: 5.2, target: 5 },
  { category: 'Drowsiness', avgTime: 12.3, target: 15 },
  { category: 'Unauthorized', avgTime: 6.8, target: 8 },
  { category: 'Fire Safety', avgTime: 15.6, target: 20 },
];

export const systemHealthMetrics = {
  cpu: 45,
  gpu: 78,
  memory: 62,
  streamLatency: 125,
  inferenceSpeed: 28,
  dbHealth: 98,
};
