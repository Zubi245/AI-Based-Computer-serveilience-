'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Circle, MapPin, Clock, X, Circle as CircleIcon } from 'lucide-react';
import { format } from 'date-fns';
import { socketService } from '@/services/socketService';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

interface CameraFeedCardProps {
  camera: any;
  delay?: number;
}

export default function CameraFeedCard({ camera, delay = 0 }: CameraFeedCardProps) {
  const statusColors: Record<string, string> = {
    active: 'text-success border-success/30 bg-success/10',
    inactive: 'text-gray-400 border-gray-600 bg-gray-800/50',
    maintenance: 'text-warning border-warning/30 bg-warning/10',
  };

  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);

  useEffect(() => {
    const unsubscribe = socketService.onRecording((data: any) => {
      if (data.cameraId === camera.id) {
        if (data.action === 'started') {
          setIsRecording(true);
          setRecordingStartTime(new Date());
          setRecordingError(null);
          toast.success(`Recording started for ${camera.name}`, {
            icon: '🔴',
            duration: 3000,
          });
        } else if (data.action === 'stopped') {
          setIsRecording(false);
          setRecordingStartTime(null);
          toast.success(`Recording stopped for ${camera.name}`, {
            icon: '⏹️',
            duration: 3000,
          });
        } else if (data.action === 'error') {
          setIsRecording(false);
          setRecordingError(data.error || 'Recording error');
          toast.error(`Recording error: ${data.error}`, {
            duration: 4000,
          });
        }
      }
    });

    try {
      socketService.getRecordingStatus();
    } catch (e) {
      // Socket might not be connected yet
    }

    return unsubscribe;
  }, [camera.id]);

  const handleToggleRecording = () => {
    const token = authService.getToken();
    if (!token) {
      toast.error('Please login to control recording');
      return;
    }

    try {
      if (!isRecording) {
        socketService.startRecording(camera.id, camera.rtspUrl);
      } else {
        socketService.stopRecording(camera.id);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle recording');
      setRecordingError(error.message);
    }
  };

  const recordingDuration = recordingStartTime
    ? Math.floor((Date.now() - recordingStartTime.getTime()) / 1000)
    : 0;

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-surface-card backdrop-blur-xl border border-navy-700/50 rounded-xl overflow-hidden hover:border-info/50 transition-all duration-300 group"
    >
      <div className="relative aspect-video bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-950">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-info to-transparent animate-scan" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-16 h-16 text-navy-700 group-hover:text-info transition-colors" />
          </div>
        </div>

        {camera.status === 'active' && (
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-danger/90 backdrop-blur-sm rounded-full">
            <Circle className="w-2 h-2 fill-white animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Live</span>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-3 left-14 flex items-center gap-2 px-3 py-1.5 bg-red-900 backdrop-blur-sm rounded-full border border-red-500/50">
            <CircleIcon className="w-2 h-2 fill-white animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Recording</span>
          </div>
        )}

        {isRecording && recordingStartTime && (
          <div className="absolute top-12 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-xs text-white font-mono">
            {formatDuration(recordingDuration)}
          </div>
        )}

        <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
          <span className="text-xs font-mono font-bold text-white">{camera.id}</span>
        </div>

        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
          <span className="text-xs font-mono text-white">
            {format(new Date(), 'HH:mm:ss')}
          </span>
        </div>

        {camera.status === 'active' && (
          <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-success/90 backdrop-blur-sm rounded-lg">
            <span className="text-xs font-bold text-white">AI Active</span>
          </div>
        )}

        {recordingError && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-red-900/80 backdrop-blur-sm rounded-lg text-xs text-red-100 text-center">
            {recordingError}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{camera.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{camera.zone}</span>
            </div>
          </div>
          <span
            className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${statusColors[camera.status] || statusColors.inactive}`}
          >
            {camera.status}
          </span>
        </div>

        {camera.detectionTypes && (
          <div className="flex flex-wrap gap-1 mb-3">
            {camera.detectionTypes.smoking && (
              <span className="px-2 py-1 text-xs bg-danger/20 text-danger border border-danger/30 rounded-full font-medium">
                🚬 Smoking
              </span>
            )}
            {camera.detectionTypes.sleeping && (
              <span className="px-2 py-1 text-xs bg-warning/20 text-warning border border-warning/30 rounded-full font-medium">
                😴 Sleeping
              </span>
            )}
            {camera.detectionTypes.fire && (
              <span className="px-2 py-1 text-xs bg-danger/20 text-danger border border-danger/30 rounded-full font-medium">
                🔥 Fire
              </span>
            )}
            {camera.detectionTypes.mobile && (
              <span className="px-2 py-1 text-xs bg-warning/20 text-warning border border-warning/30 rounded-full font-medium">
                📱 Mobile
              </span>
            )}
            {camera.detectionTypes.unethical && (
              <span className="px-2 py-1 text-xs bg-danger/20 text-danger border border-danger/30 rounded-full font-medium">
                ⚠️ Unethical
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-navy-700/50">
          <div>
            <p className="text-xs text-gray-400 mb-1">Resolution</p>
            <p className="text-sm font-bold text-white">{camera.resolution}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Health</p>
            <p className="text-sm font-bold text-success">{camera.health}%</p>
          </div>
        </div>

        <button
          onClick={handleToggleRecording}
          className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white border border-red-500/50'
              : 'bg-navy-800/50 hover:bg-navy-800 text-white border border-navy-700/50'
          }`}
        >
          {isRecording ? (
            <>
              <X className="w-4 h-4 fill-white" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 fill-white" />
              <span>Start Recording</span>
            </>
          )}
        </button>

        {isRecording && (
          <p className="text-xs text-red-400 text-center mt-2 font-medium">
            🔴 Recording for {formatDuration(recordingDuration)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
