const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const recordingService = require('./services/recordingService');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Start automatic cleanup scheduler (runs every 10 minutes, deletes files older than 1 hour)
recordingService.startCleanupScheduler();

const io = new Server(4001, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware for socket authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;

  if (!token) {
    // Allow unauthenticated connections for public events
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.userId;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    // Don't reject, just don't set user info
    socket.userId = null;
    socket.userRole = null;
    next();
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id} (user: ${socket.userId || 'anonymous'})`);

  // Join user-specific room for targeted notifications
  if (socket.userId) {
    socket.join(`user:${socket.userId}`);
    socket.join(`role:${socket.userRole}`);
  }

  // Join role-based rooms for broadcasts
  if (socket.userRole) {
    socket.join(`role:${socket.userRole}`);
  }

  // Handle client subscribing to camera alerts
  socket.on('subscribe:camera', (cameraId) => {
    socket.join(`camera:${cameraId}`);
  });

  socket.on('unsubscribe:camera', (cameraId) => {
    socket.leave(`camera:${cameraId}`);
  });

  // Handle client subscribing to zone alerts
  socket.on('subscribe:zone', (zoneId) => {
    socket.join(`zone:${zoneId}`);
  });

  socket.on('unsubscribe:zone', (zoneId) => {
    socket.leave(`zone:${zoneId}`);
  });

  // Handle ping for connection health
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });

  // Start recording for a camera
  socket.on('recording:start', async (data) => {
    const { cameraId, rtspUrl } = data;
    if (!cameraId || !rtspUrl) {
      socket.emit('recording:error', { cameraId, error: 'Camera ID and RTSP URL required' });
      return;
    }

    try {
      const result = recordingService.startRecording(cameraId, rtspUrl);
      if (result.success) {
        socket.emit('recording:started', { cameraId, outputPath: result.outputPath });
        io.emit('recording:status', { cameraId, isRecording: true });
      } else {
        socket.emit('recording:error', { cameraId, error: result.error });
      }
    } catch (err) {
      socket.emit('recording:error', { cameraId, error: err.message });
    }
  });

  // Stop recording for a camera
  socket.on('recording:stop', (data) => {
    const { cameraId } = data;
    if (!cameraId) {
      socket.emit('recording:error', { cameraId: 'unknown', error: 'Camera ID required' });
      return;
    }

    const stopped = recordingService.stopRecording(cameraId);
    if (stopped) {
      socket.emit('recording:stopped', { cameraId });
      io.emit('recording:status', { cameraId, isRecording: false });
    } else {
      socket.emit('recording:error', { cameraId, error: 'No active recording found' });
    }
  });

  // Get recording status for all cameras
  socket.on('recording:status:get', () => {
    const status = recordingService.getRecordingStatus();
    const storage = recordingService.getStorageStats();
    socket.emit('recording:status:list', { recordings: status, storage });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

/**
 * Emit a new alert to all connected clients
 * Call this from your API routes when a new alert is created
 */
function emitNewAlert(alertData) {
  io.emit('alert:new', alertData);
  io.to(`camera:${alertData.cameraId}`).emit('alert:camera', alertData);
  if (alertData.zoneId) {
    io.to(`zone:${alertData.zoneId}`).emit('alert:zone', alertData);
  }

  // Send to administrators and supervisors
  io.to('role:administrator').emit('alert:admin', alertData);
  io.to('role:supervisor').emit('alert:supervisor', alertData);
}

/**
 * Emit camera status change
 */
function emitCameraStatus(cameraId, status, health) {
  io.to(`camera:${cameraId}`).emit('camera:status', { cameraId, status, health });
  io.emit('camera:status', { cameraId, status, health });
}

/**
 * Emit zone occupancy update
 */
function emitZoneOccupancy(zoneId, occupancy) {
  io.to(`zone:${zoneId}`).emit('zone:occupancy', { zoneId, occupancy });
  io.emit('zone:occupancy', { zoneId, occupancy });
}

/**
 * Emit system health update
 */
function emitSystemHealth(healthData) {
  io.emit('system:health', healthData);
}

module.exports = { io, emitNewAlert, emitCameraStatus, emitZoneOccupancy, emitSystemHealth };
