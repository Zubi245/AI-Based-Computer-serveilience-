import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  if (req.method === 'GET') {
    try {
      const { status, zoneId, search } = req.query;

      const cameras = await prisma.camera.findMany({
        where: {
          status: status === 'active' || status === 'inactive' || status === 'maintenance' ? (status as string) : undefined,
          zoneId: zoneId as string | undefined,
          name: search ? { contains: search as string } : undefined,
        },
        include: {
          zone: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { alerts: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({ cameras });
    } catch (error) {
      console.error('Get cameras error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    return requireRole(['administrator', 'supervisor'])(async (req, res, user) => {
      try {
        const { name, zoneName, rtspUrl, zoneId, detectionTypes } = req.body;

        if (!name || !rtspUrl) {
          return res.status(400).json({ error: 'Camera name and RTSP URL are required' });
        }

        const camera = await prisma.camera.create({
          data: {
            name,
            zoneName: zoneName || 'Unassigned',
            rtspUrl,
            zoneId: zoneId || null,
            detectionTypes: detectionTypes || {},
            status: 'active',
            health: 100,
            createdById: user.id,
          },
          include: {
            zone: true,
            createdBy: {
              select: { id: true, name: true },
            },
          },
        });

        return res.status(201).json({ message: 'Camera created', camera });
      } catch (error) {
        console.error('Create camera error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);
