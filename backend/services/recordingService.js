const fs = require('fs');
const path = require('path');

const RECORDINGS_DIR = path.join(__dirname, '../recordings');
const SNAPSHOTS_DIR = path.join(__dirname, '../public/uploads/snapshots');

const RECORDING_RETENTION_HOURS = 1; // 1 hour retention for video recordings
const SNAPSHOT_RETENTION_DAYS = 7; // 7 days retention for snapshots
const CLEANUP_INTERVAL_MINUTES = 10; // Cleanup check every 10 minutes
const MAX_STORAGE_GB = 5; // Max 5GB storage limit

// Ensure directories exist
[RECORDINGS_DIR, SNAPSHOTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

class RecordingService {
  constructor() {
    this.activeRecordings = new Map(); // cameraId → { ffmpegProcess, startTime, outputPath }
    this.cleanupInterval = null;
  }

  // ================ RECORDING METHODS ================

  /**
   * Start recording a camera stream
   */
  startRecording(cameraId, rtspUrl) {
    try {
      // Stop existing recording if any
      this.stopRecording(cameraId);

      const cameraDir = path.join(RECORDINGS_DIR, cameraId);
      if (!fs.existsSync(cameraDir)) {
        fs.mkdirSync(cameraDir, { recursive: true });
      }

      // Per-day folder: YYYY-MM-DD
      const dateStr = new Date().toISOString().split('T')[0];
      const dateDir = path.join(cameraDir, dateStr);
      if (!fs.existsSync(dateDir)) {
        fs.mkdirSync(dateDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputPath = path.join(dateDir, `recording_${timestamp}.mp4`);

      const ffmpeg = require('fluent-ffmpeg');
      const ffmpegProcess = ffmpeg(rtspUrl)
        .inputOptions([
          '-rtsp_transport', 'tcp',
          '-stimeout', '5000000',
          '-reconnect', '1',
          '-reconnect_streamed', '1',
          '-reconnect_delay_max', '5'
        ])
        .outputOptions([
          '-c', 'copy',
          '-f', 'segment',
          '-segment_time', '3600',
          '-segment_format', 'mp4',
          '-reset_timestamps', '1',
          '-strftime', '1'
        ])
        .output(outputPath)
        .on('start', (cmd) => {
          console.log(`📹 Recording started for camera ${cameraId}: ${outputPath}`);
        })
        .on('error', (err) => {
          console.error(`❌ Recording error for camera ${cameraId}:`, err.message);
          this.activeRecordings.delete(cameraId);
        })
        .on('end', () => {
          console.log(`✅ Recording ended for camera ${cameraId}`);
          this.activeRecordings.delete(cameraId);
        });

      ffmpegProcess.run();

      this.activeRecordings.set(cameraId, {
        ffmpegProcess,
        startTime: new Date(),
        outputPath,
        cameraId,
        rtspUrl,
      });

      return {
        success: true,
        outputPath,
        message: 'Recording started successfully',
      };
    } catch (error) {
      console.error(`❌ Failed to start recording for camera ${cameraId}:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Stop recording for a specific camera
   */
  stopRecording(cameraId) {
    const recording = this.activeRecordings.get(cameraId);
    if (recording) {
      try {
        recording.ffmpegProcess.kill('SIGKILL');
      } catch (e) {
        // Process might already be dead
      }
      this.activeRecordings.delete(cameraId);
      console.log(`🛑 Recording stopped for camera ${cameraId}`);
      return true;
    }
    return false;
  }

  /**
   * Get recording status for all cameras
   */
  getRecordingStatus() {
    const status = [];
    for (const [cameraId, recording] of this.activeRecordings.entries()) {
      const duration = Math.round((new Date() - recording.startTime) / 1000 / 60);
      status.push({
        cameraId,
        isRecording: true,
        startedAt: recording.startTime.toISOString(),
        durationMinutes: duration,
        outputPath: recording.outputPath,
      });
    }
    return status;
  }

  /**
   * Get recording status for a specific camera
   */
  getCameraRecordingStatus(cameraId) {
    const recording = this.activeRecordings.get(cameraId);
    if (!recording) {
      return { cameraId, isRecording: false };
    }
    const duration = Math.round((new Date() - recording.startTime) / 1000 / 60);
    return {
      cameraId,
      isRecording: true,
      startedAt: recording.startTime.toISOString(),
      durationMinutes: duration,
      outputPath: recording.outputPath,
    };
  }

  // ================ SNAPSHOT METHODS ================

  /**
   * Save a snapshot image for an alert
   * Only saves when alert occurs (called from alert creation)
   */
  saveSnapshot(cameraId, alertId, imageBuffer, filename = null) {
    try {
      const cameraDir = path.join(SNAPSHOTS_DIR, cameraId);
      if (!fs.existsSync(cameraDir)) {
        fs.mkdirSync(cameraDir, { recursive: true });
      }

      if (!filename) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        filename = `alert_${alertId}_${timestamp}.jpg`;
      }

      // Per-day folder: YYYY-MM-DD
      const dateStr = new Date().toISOString().split('T')[0];
      const dateDir = path.join(cameraDir, dateStr);
      if (!fs.existsSync(dateDir)) {
        fs.mkdirSync(dateDir, { recursive: true });
      }

      const filePath = path.join(dateDir, filename);
      fs.writeFileSync(filePath, imageBuffer);

      const relativePath = `/uploads/snapshots/${cameraId}/${dateStr}/${filename}`;

      console.log(`📸 Snapshot saved: ${filePath}`);

      return {
        success: true,
        filePath,
        relativePath,
        filename,
        cameraId,
        alertId,
      };
    } catch (error) {
      console.error(`❌ Failed to save snapshot for camera ${cameraId}:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Delete a specific snapshot file
   */
  deleteSnapshot(filePath) {
    try {
      const fullPath = path.join(__dirname, '..', filePath.replace(/^\//, ''));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`🗑️ Snapshot deleted: ${fullPath}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`❌ Failed to delete snapshot:`, error.message);
      return false;
    }
  }

  // ================ CLEANUP METHODS ================

  /**
   * Auto-delete recordings older than 1 hour
   * Auto-delete snapshots older than 7 days
   */
  cleanupOldFiles() {
    console.log('🧹 Running cleanup for old recordings and snapshots...');
    const results = {
      recordings: { deletedCount: 0, deletedSizeMB: 0 },
      snapshots: { deletedCount: 0, deletedSizeMB: 0 },
    };

    // Cleanup recordings older than 1 hour (per-day folders: camera/YYYY-MM-DD/file)
    const recordingCutoff = new Date(Date.now() - RECORDING_RETENTION_HOURS * 60 * 60 * 1000);
    try {
      const cameraDirs = fs.readdirSync(RECORDINGS_DIR);
      for (const cameraDir of cameraDirs) {
        const cameraPath = path.join(RECORDINGS_DIR, cameraDir);
        if (!fs.statSync(cameraPath).isDirectory()) continue;
        const dateDirs = fs.readdirSync(cameraPath);
        for (const dateDir of dateDirs) {
          const datePath = path.join(cameraPath, dateDir);
          if (!fs.statSync(datePath).isDirectory()) continue;
          const files = fs.readdirSync(datePath);
          for (const file of files) {
            const filePath = path.join(datePath, file);
            const stat = fs.statSync(filePath);
            if (stat.isFile() && stat.mtime < recordingCutoff) {
              results.recordings.deletedSizeMB += stat.size / (1024 * 1024);
              results.recordings.deletedCount++;
              fs.unlinkSync(filePath);
              console.log(`🗑️ Deleted recording: ${filePath}`);
            }
          }
          const remainingFiles = fs.readdirSync(datePath);
          if (remainingFiles.length === 0) {
            fs.rmdirSync(datePath);
          }
        }
        const remainingDates = fs.readdirSync(cameraPath);
        if (remainingDates.length === 0) {
          fs.rmdirSync(cameraPath);
        }
      }
    } catch (error) {
      console.error('❌ Recording cleanup error:', error.message);
    }

    // Cleanup snapshots older than 7 days (per-day folders: camera/YYYY-MM-DD/file)
    const snapshotCutoff = new Date(Date.now() - SNAPSHOT_RETENTION_DAYS * 24 * 60 * 60 * 1000);
    try {
      const cameraDirs = fs.readdirSync(SNAPSHOTS_DIR);
      for (const cameraDir of cameraDirs) {
        const cameraPath = path.join(SNAPSHOTS_DIR, cameraDir);
        if (!fs.statSync(cameraPath).isDirectory()) continue;
        const dateDirs = fs.readdirSync(cameraPath);
        for (const dateDir of dateDirs) {
          const datePath = path.join(cameraPath, dateDir);
          if (!fs.statSync(datePath).isDirectory()) continue;
          const files = fs.readdirSync(datePath);
          for (const file of files) {
            const filePath = path.join(datePath, file);
            const stat = fs.statSync(filePath);
            if (stat.isFile() && stat.mtime < snapshotCutoff) {
              results.snapshots.deletedSizeMB += stat.size / (1024 * 1024);
              results.snapshots.deletedCount++;
              fs.unlinkSync(filePath);
              console.log(`🗑️ Deleted snapshot: ${filePath}`);
            }
          }
          const remainingFiles = fs.readdirSync(datePath);
          if (remainingFiles.length === 0) {
            fs.rmdirSync(datePath);
          }
        }
        const remainingDates = fs.readdirSync(cameraPath);
        if (remainingDates.length === 0) {
          fs.rmdirSync(cameraPath);
        }
      }
    } catch (error) {
      console.error('❌ Snapshot cleanup error:', error.message);
    }

    console.log(`✅ Cleanup complete: ` +
      `${results.recordings.deletedCount} recordings, ` +
      `${results.snapshots.deletedCount} snapshots deleted`);
    return results;
  }

  /**
   * Check storage usage and delete oldest if over limit
   */
  enforceStorageLimit() {
    try {
      let totalSize = 0;
      const allFiles = [];

      // Scan recordings (per-day folders: camera/YYYY-MM-DD/file)
      const recordingDirs = fs.readdirSync(RECORDINGS_DIR);
      for (const cameraDir of recordingDirs) {
        const cameraPath = path.join(RECORDINGS_DIR, cameraDir);
        if (!fs.statSync(cameraPath).isDirectory()) continue;
        const dateDirs = fs.readdirSync(cameraPath);
        for (const dateDir of dateDirs) {
          const datePath = path.join(cameraPath, dateDir);
          if (!fs.statSync(datePath).isDirectory()) continue;
          const files = fs.readdirSync(datePath);
          for (const file of files) {
            const filePath = path.join(datePath, file);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
              totalSize += stat.size;
              allFiles.push({ path: filePath, mtime: stat.mtime, size: stat.size, type: 'recording' });
            }
          }
        }
      }

      // Scan snapshots
      const snapshotDirs = fs.readdirSync(SNAPSHOTS_DIR);
      for (const cameraDir of snapshotDirs) {
        const cameraPath = path.join(SNAPSHOTS_DIR, cameraDir);
        if (!fs.statSync(cameraPath).isDirectory()) continue;
        const dateDirs = fs.readdirSync(cameraPath);
        for (const dateDir of dateDirs) {
          const datePath = path.join(cameraPath, dateDir);
          if (!fs.statSync(datePath).isDirectory()) continue;
          const files = fs.readdirSync(datePath);
          for (const file of files) {
            const filePath = path.join(datePath, file);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
              totalSize += stat.size;
              allFiles.push({ path: filePath, mtime: stat.mtime, size: stat.size, type: 'snapshot' });
            }
          }
        }
      }

      const maxSizeBytes = MAX_STORAGE_GB * 1024 * 1024 * 1024;

      if (totalSize > maxSizeBytes) {
        console.log(`⚠️ Storage limit exceeded: ${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB > ${MAX_STORAGE_GB} GB`);
        allFiles.sort((a, b) => a.mtime - b.mtime);

        let deletedCount = 0;
        let freedSize = 0;

        for (const file of allFiles) {
          if (totalSize <= maxSizeBytes) break;
          fs.unlinkSync(file.path);
          totalSize -= file.size;
          freedSize += file.size;
          deletedCount++;
          console.log(`🗑️ Storage limit delete: ${file.path}`);
        }

        console.log(`✅ Storage cleanup: ${deletedCount} files deleted, ${(freedSize / 1024 / 1024).toFixed(2)} MB freed`);
        return { deletedCount, freedSizeMB: (freedSize / 1024 / 1024).toFixed(2) };
      }

      return { deletedCount: 0, freedSizeMB: 0 };
    } catch (error) {
      console.error('❌ Storage limit check error:', error.message);
      return { deletedCount: 0, freedSizeMB: 0 };
    }
  }

  /**
   * Start the automatic cleanup scheduler
   */
  startCleanupScheduler() {
    // Run cleanup every 10 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldFiles();
      this.enforceStorageLimit();
    }, CLEANUP_INTERVAL_MINUTES * 60 * 1000);

    console.log(`⏰ Cleanup scheduler started (every ${CLEANUP_INTERVAL_MINUTES} minutes)`);
    console.log(`   📹 Recordings: delete after ${RECORDING_RETENTION_HOURS} hour`);
    console.log(`   📸 Snapshots: delete after ${SNAPSHOT_RETENTION_DAYS} days`);
  }

  /**
   * Stop the cleanup scheduler
   */
  stopCleanupScheduler() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('⏹️ Cleanup scheduler stopped');
    }
  }

  /**
   * Get storage statistics
   */
  getStorageStats() {
    try {
      let totalSize = 0;
      let totalFiles = 0;
      const cameraStats = {};

      const scanDir = (dir, type) => {
        try {
          const cameraDirs = fs.readdirSync(dir);
          for (const cameraDir of cameraDirs) {
            const cameraPath = path.join(dir, cameraDir);
            if (!fs.statSync(cameraPath).isDirectory()) continue;
            if (type === 'snapshot') {
              const dateDirs = fs.readdirSync(cameraPath);
              for (const dateDir of dateDirs) {
                const datePath = path.join(cameraPath, dateDir);
                if (!fs.statSync(datePath).isDirectory()) continue;
                const files = fs.readdirSync(datePath);
                let cameraSize = 0;
                let cameraFileCount = 0;
                for (const file of files) {
                  const filePath = path.join(datePath, file);
                  const stat = fs.statSync(filePath);
                  if (stat.isFile()) {
                    cameraSize += stat.size;
                    cameraFileCount++;
                    totalSize += stat.size;
                    totalFiles++;
                  }
                }
                if (!cameraStats[cameraDir]) {
                  cameraStats[cameraDir] = { recordings: 0, snapshots: 0, sizeMB: 0 };
                }
                cameraStats[cameraDir]['snapshots'] = cameraFileCount;
                cameraStats[cameraDir].sizeMB = (cameraStats[cameraDir].sizeMB + (cameraSize / 1024 / 1024)).toFixed(2);
              }
            } else {
              const dateDirs = fs.readdirSync(cameraPath);
              for (const dateDir of dateDirs) {
                const datePath = path.join(cameraPath, dateDir);
                if (!fs.statSync(datePath).isDirectory()) continue;
                const files = fs.readdirSync(datePath);
                let cameraSize = 0;
                let cameraFileCount = 0;
                for (const file of files) {
                  const filePath = path.join(datePath, file);
                  const stat = fs.statSync(filePath);
                  if (stat.isFile()) {
                    cameraSize += stat.size;
                    cameraFileCount++;
                    totalSize += stat.size;
                    totalFiles++;
                  }
                }
                if (!cameraStats[cameraDir]) {
                  cameraStats[cameraDir] = { recordings: 0, snapshots: 0, sizeMB: 0 };
                }
                cameraStats[cameraDir]['recordings'] = cameraFileCount;
                cameraStats[cameraDir].sizeMB = (cameraStats[cameraDir].sizeMB + (cameraSize / 1024 / 1024)).toFixed(2);
              }
            }
          }
        } catch (e) {
          // Directory might not exist yet
        }
      };

      scanDir(RECORDINGS_DIR, 'recordings');
      scanDir(SNAPSHOTS_DIR, 'snapshots');

      return {
        totalFiles,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
        totalSizeGB: (totalSize / 1024 / 1024 / 1024).toFixed(3),
        maxStorageGB: MAX_STORAGE_GB,
        recordingRetentionHours: RECORDING_RETENTION_HOURS,
        snapshotRetentionDays: SNAPSHOT_RETENTION_DAYS,
        cameras: cameraStats,
      };
    } catch (error) {
      console.error('❌ Storage stats error:', error.message);
      return {
        totalFiles: 0,
        totalSizeMB: '0.00',
        totalSizeGB: '0.000',
        maxStorageGB: MAX_STORAGE_GB,
        recordingRetentionHours: RECORDING_RETENTION_HOURS,
        snapshotRetentionDays: SNAPSHOT_RETENTION_DAYS,
        cameras: {},
      };
    }
  }
}

module.exports = new RecordingService();
