import { io, Socket } from 'socket.io-client';
import { alertService } from './alertService';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4001';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private listeners: {
    alert: Array<(data: any) => void>;
    cameraStatus: Array<(data: any) => void>;
    cameraHealth: Array<(data: any) => void>;
    zoneOccupancy: Array<(data: any) => void>;
    systemHealth: Array<(data: any) => void>;
    recording: Array<(data: any) => void>;
    recordingStatus: Array<(data: any) => void>;
  } = {
    alert: [],
    cameraStatus: [],
    cameraHealth: [],
    zoneOccupancy: [],
    systemHealth: [],
    recording: [],
    recordingStatus: [],
  };

  connect = (token: string | null = null) => {
    if (this.isConnected) return Promise.resolve({ connected: true });

    return new Promise((resolve, reject) => {
      try {
        const socket = io(SOCKET_URL, {
          auth: { token },
          transports: ['websocket', 'polling'],
        });
        this.socket = socket;

        socket.on('connect', () => {
          this.isConnected = true;
          resolve({ connected: true, id: socket.id });
        });

        this.socket.on('connect_error', (error) => {
          this.isConnected = false;
          reject(error);
        });

        this.socket.on('disconnect', () => {
          this.isConnected = false;
        });

        // Alert events
        this.socket.on('alert:new', (data: any) => {
          this.listeners.alert.forEach((cb) => cb(data));
        });

        this.socket.on('alert:camera', (data: any) => {
          this.listeners.alert.forEach((cb) => cb(data));
        });

        this.socket.on('alert:admin', (data: any) => {
          this.listeners.alert.forEach((cb) => cb(data));
        });

        this.socket.on('alert:supervisor', (data: any) => {
          this.listeners.alert.forEach((cb) => cb(data));
        });

        // Camera status events
        this.socket.on('camera:status', (data: any) => {
          this.listeners.cameraStatus.forEach((cb) => cb(data));
        });

        // Zone occupancy events
        this.socket.on('zone:occupancy', (data: any) => {
          this.listeners.zoneOccupancy.forEach((cb) => cb(data));
        });

        // System health events
        this.socket.on('system:health', (data: any) => {
          this.listeners.systemHealth.forEach((cb) => cb(data));
        });

        // Recording events
        this.socket.on('recording:started', (data: any) => {
          this.listeners.recording.forEach((cb) => cb({ ...data, action: 'started' }));
        });

        this.socket.on('recording:stopped', (data: any) => {
          this.listeners.recording.forEach((cb) => cb({ ...data, action: 'stopped' }));
        });

        this.socket.on('recording:error', (data: any) => {
          this.listeners.recording.forEach((cb) => cb({ ...data, action: 'error' }));
        });

        this.socket.on('recording:status', (data: any) => {
          this.listeners.recording.forEach((cb) => cb({ ...data, action: 'status' }));
        });

        this.socket.on('recording:status:list', (data: any) => {
          this.listeners.recordingStatus.forEach((cb) => cb(data));
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  disconnect = () => {
    this.isConnected = false;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners = {
      alert: [],
      cameraStatus: [],
      cameraHealth: [],
      zoneOccupancy: [],
      systemHealth: [],
      recording: [],
      recordingStatus: [],
    };
  };

  onAlert = (callback: (data: any) => void) => {
    this.listeners.alert.push(callback);
    return () => {
      this.listeners.alert = this.listeners.alert.filter((cb) => cb !== callback);
    };
  };

  onCameraStatus = (callback: (data: any) => void) => {
    this.listeners.cameraStatus.push(callback);
    return () => {
      this.listeners.cameraStatus = this.listeners.cameraStatus.filter((cb) => cb !== callback);
    };
  };

  onCameraHealth = (callback: (data: any) => void) => {
    this.listeners.cameraHealth.push(callback);
    return () => {
      this.listeners.cameraHealth = this.listeners.cameraHealth.filter((cb) => cb !== callback);
    };
  };

  onZoneOccupancy = (callback: (data: any) => void) => {
    this.listeners.zoneOccupancy.push(callback);
    return () => {
      this.listeners.zoneOccupancy = this.listeners.zoneOccupancy.filter((cb) => cb !== callback);
    };
  };

  onSystemHealth = (callback: (data: any) => void) => {
    this.listeners.systemHealth.push(callback);
    return () => {
      this.listeners.systemHealth = this.listeners.systemHealth.filter((cb) => cb !== callback);
    };
  };

  onRecording = (callback: (data: any) => void) => {
    this.listeners.recording.push(callback);
    return () => {
      this.listeners.recording = this.listeners.recording.filter((cb) => cb !== callback);
    };
  };

  onRecordingStatus = (callback: (data: any) => void) => {
    this.listeners.recordingStatus.push(callback);
    return () => {
      this.listeners.recordingStatus = this.listeners.recordingStatus.filter((cb) => cb !== callback);
    };
  };

  startRecording = (cameraId: string, rtspUrl: string) => {
    if (!this.isConnected) {
      throw new Error('Socket not connected');
    }
    this.socket!.emit('recording:start', { cameraId, rtspUrl });
  };

  stopRecording = (cameraId: string) => {
    if (!this.isConnected) {
      throw new Error('Socket not connected');
    }
    this.socket!.emit('recording:stop', { cameraId });
  };

  getRecordingStatus = () => {
    if (!this.isConnected) {
      throw new Error('Socket not connected');
    }
    this.socket!.emit('recording:status:get');
  };

  getStatus = () => ({
    connected: this.isConnected,
    url: SOCKET_URL,
  });
}

export const socketService = new SocketService();
export default socketService;
