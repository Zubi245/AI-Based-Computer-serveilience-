import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy HH:mm')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy HH:mm') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format percentage
 * @param {number} value - Value to format (0-1 or 0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  const percentage = value > 1 ? value : value * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format confidence score
 * @param {number} confidence - Confidence value (0-1)
 * @returns {string} Formatted confidence string
 */
export const formatConfidence = (confidence) => {
  return formatPercentage(confidence, 0);
};

/**
 * Format camera status
 * @param {string} status - Camera status
 * @returns {string} Formatted status string
 */
export const formatCameraStatus = (status) => {
  const statusMap = {
    active: 'Active',
    inactive: 'Inactive',
    maintenance: 'Maintenance',
  };
  return statusMap[status] || status;
};

/**
 * Format alert severity
 * @param {string} severity - Alert severity
 * @returns {string} Formatted severity string
 */
export const formatSeverity = (severity) => {
  const severityMap = {
    critical: 'Critical',
    warning: 'Warning',
    info: 'Information',
  };
  return severityMap[severity] || severity;
};

/**
 * Format violation type
 * @param {string} type - Violation type
 * @returns {string} Formatted violation type string
 */
export const formatViolationType = (type) => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format duration in seconds to readable string
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get severity color class
 * @param {string} severity - Alert severity
 * @returns {string} Tailwind color class
 */
export const getSeverityColor = (severity) => {
  const colorMap = {
    critical: 'text-danger',
    warning: 'text-warning',
    info: 'text-info',
  };
  return colorMap[severity] || 'text-gray-400';
};

/**
 * Get status color class
 * @param {string} status - Status value
 * @returns {string} Tailwind color class
 */
export const getStatusColor = (status) => {
  const colorMap = {
    active: 'text-success',
    inactive: 'text-gray-400',
    maintenance: 'text-warning',
    resolved: 'text-success',
    acknowledged: 'text-warning',
  };
  return colorMap[status] || 'text-gray-400';
};

export default {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatPercentage,
  formatConfidence,
  formatCameraStatus,
  formatSeverity,
  formatViolationType,
  formatFileSize,
  formatDuration,
  truncateText,
  getSeverityColor,
  getStatusColor,
};
