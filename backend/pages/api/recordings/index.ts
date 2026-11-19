import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, requireRole } from '@/lib/auth';
import recordingService from '@/services/recordingService';

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  if (req.method === 'GET') {
    try {
      const status = recordingService.getRecordingStatus();
      const storage = recordingService.getStorageStats();

      return res.status(200).json({
        activeRecordings: status,
        storage: storage,
      });
    } catch (error) {
      console.error('Get recordings error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    return requireRole(['administrator', 'supervisor'])(async (req, res, user) => {
      try {
        const { cameraId, rtspUrl } = req.body;

        if (!cameraId || !rtspUrl) {
          return res.status(400).json({ error: 'Camera ID and RTSP URL are required' });
        }

        const result = recordingService.startRecording(cameraId, rtspUrl);

        if (result.success) {
          return res.status(200).json(result);
        } else {
          return res.status(500).json(result);
        }
      } catch (error) {
        console.error('Start recording error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);
