import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Camera ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const camera = await prisma.camera.findUnique({
        where: { id },
        include: {
          zone: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          alerts: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!camera) {
        return res.status(404).json({ error: 'Camera not found' });
      }

      return res.status(200).json({ camera });
    } catch (error) {
      console.error('Get camera error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    return requireRole(['administrator', 'supervisor'])(async (req, res, user) => {
      try {
        const { name, zoneName, rtspUrl, status, zoneId, health, detectionTypes } = req.body;

        const camera = await prisma.camera.update({
          where: { id },
          data: {
            ...(name && { name }),
            ...(zoneName && { zoneName }),
            ...(rtspUrl && { rtspUrl }),
            ...(status && { status }),
            ...(zoneId !== undefined && { zoneId: zoneId || null }),
            ...(health !== undefined && { health }),
            ...(detectionTypes && { detectionTypes }),
            ...(status === 'active' && { lastActive: new Date() }),
          },
          include: {
            zone: true,
          },
        });

        return res.status(200).json({ message: 'Camera updated', camera });
      } catch (error) {
        console.error('Update camera error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  if (req.method === 'DELETE') {
    return requireRole(['administrator'])(async (req, res, user) => {
      try {
        await prisma.camera.delete({
          where: { id },
        });

        return res.status(200).json({ message: 'Camera deleted' });
      } catch (error) {
        console.error('Delete camera error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);
