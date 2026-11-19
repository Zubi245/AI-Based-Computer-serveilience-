'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, Maximize2 } from 'lucide-react';
import CameraFeedCard from '@/components/CameraFeedCard';
import { cameraService } from '@/services/cameraService';
import { socketService } from '@/services/socketService';
import { authService } from '@/services/authService';

export default function LiveMonitoring() {
  const [cameras, setCameras] = useState<any[]>([]);
  const [gridSize, setGridSize] = useState(3);
  const [loading, setLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    loadCameras();

    const token = authService.getToken();
    socketService.connect(token);

    const unsubscribeCameraStatus = socketService.onCameraStatus((data: any) => {
      setCameras((prev) =>
        prev.map((cam) =>
          cam.id === data.cameraId ? { ...cam, status: data.status, health: data.health } : cam
        )
      );
    });

    const unsubscribeCameraHealth = socketService.onCameraHealth((data: any) => {
      setCameras((prev) =>
        prev.map((cam) =>
          cam.id === data.cameraId ? { ...cam, health: data.health } : cam
        )
      );
    });

    return () => {
      unsubscribeCameraStatus();
      unsubscribeCameraHealth();
    };
  }, []);

  const loadCameras = async () => {
    try {
      const data = await cameraService.getAllCameras();
      const active = data.filter((c: any) => c.status === 'active');
      setCameras(active);
      setOnlineCount(active.length);
    } catch (error) {
      console.error('Error loading cameras:', error);
    } finally {
      setLoading(false);
    }
  };

  const gridClasses: Record<string, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const currentOnline = cameras.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Monitoring</h1>
          <p className="text-gray-400">Real-time CCTV surveillance feeds with AI detection</p>
        </div>

        <div className="flex items-center gap-2">
          {[2, 3, 4].map((size) => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              disabled={loading}
              className={`p-2 rounded-lg transition-all ${
                gridSize === size
                  ? 'bg-info/20 text-info border border-info/30'
                  : 'bg-navy-800/50 text-gray-400 hover:text-white border border-navy-700/50'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
          ))}
          <button
            className="p-2 bg-navy-800/50 text-gray-400 hover:text-white border border-navy-700/50 rounded-lg transition-all"
            disabled={loading}
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-3 p-4 bg-danger/10 border border-danger/30 rounded-xl"
      >
        <div className="w-3 h-3 bg-danger rounded-full animate-pulse shadow-glow-red" />
        <span className="text-lg font-bold text-danger uppercase tracking-wider">
          Live Surveillance Active - {currentOnline} Cameras Online
        </span>
      </motion.div>

      {loading ? (
        <div className={`grid ${gridClasses[String(gridSize)]} gap-4`}>
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-video bg-navy-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className={`grid ${gridClasses[String(gridSize)]} gap-4`}>
          {cameras.map((camera: any, index: number) => (
            <CameraFeedCard key={camera.id} camera={camera} delay={index * 0.05} />
          ))}
        </div>
      )}
    </div>
  );
}
