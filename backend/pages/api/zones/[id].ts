import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Zone ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const zone = await prisma.zone.findUnique({
        where: { id },
        include: {
          cameras: {
            select: {
              id: true,
              name: true,
              status: true,
              health: true,
              rtspUrl: true,
            },
          },
          _count: {
            select: { cameras: true, alerts: true },
          },
        },
      });

      if (!zone) {
        return res.status(404).json({ error: 'Zone not found' });
      }

      return res.status(200).json({ zone });
    } catch (error) {
      console.error('Get zone error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    return requireRole(['administrator', 'supervisor'])(async (req, res, user) => {
      try {
        const { name, type, riskLevel, area, capacity, currentOccupancy, status, detectionRules } = req.body;

        const zone = await prisma.zone.update({
          where: { id },
          data: {
            ...(name && { name }),
            ...(type && { type }),
            ...(riskLevel && { riskLevel }),
            ...(area !== undefined && { area }),
            ...(capacity !== undefined && { capacity }),
            ...(currentOccupancy !== undefined && { currentOccupancy }),
            ...(status && { status }),
            ...(detectionRules && { detectionRules }),
          },
          include: {
            cameras: true,
          },
        });

        return res.status(200).json({ message: 'Zone updated', zone });
      } catch (error) {
        console.error('Update zone error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  if (req.method === 'DELETE') {
    return requireRole(['administrator'])(async (req, res, user) => {
      try {
        await prisma.zone.delete({
          where: { id },
        });

        return res.status(200).json({ message: 'Zone deleted' });
      } catch (error) {
        console.error('Delete zone error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);
