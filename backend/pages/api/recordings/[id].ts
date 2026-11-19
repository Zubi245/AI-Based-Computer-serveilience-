import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, requireRole } from '@/lib/auth';
import recordingService from '@/services/recordingService';

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Camera ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const status = recordingService.getCameraRecordingStatus(id);
      const storage = recordingService.getStorageStats();

      return res.status(200).json({
        cameraId: id,
        recording: status,
        storage: storage,
      });
    } catch (error) {
      console.error('Get recording status error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    return requireRole(['administrator'])(async (req, res, user) => {
      try {
        const stopped = recordingService.stopRecording(id);

        if (stopped) {
          return res.status(200).json({
            message: `Recording stopped for camera ${id}`,
            cameraId: id,
          });
        } else {
          return res.status(404).json({
            message: `No active recording found for camera ${id}`,
            cameraId: id,
          });
        }
      } catch (error) {
        console.error('Stop recording error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  if (req.method === 'POST') {
    // Manual cleanup trigger
    return requireRole(['administrator'])(async (req, res, user) => {
      try {
        const { action } = req.body;

        if (action === 'cleanup') {
          const result = recordingService.cleanupOldRecordings();
          return res.status(200).json({
            message: 'Manual cleanup completed',
            ...result,
          });
        }

        if (action === 'storage-check') {
          const result = recordingService.enforceStorageLimit();
          return res.status(200).json({
            message: 'Storage limit check completed',
            ...result,
          });
        }

        return res.status(400).json({ error: 'Invalid action. Use "cleanup" or "storage-check"' });
      } catch (error) {
        console.error('Manual action error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);
