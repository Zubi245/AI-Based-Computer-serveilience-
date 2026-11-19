import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  if (req.method === 'GET') {
    try {
      const { status, riskLevel } = req.query;

      const zones = await prisma.zone.findMany({
        where: {
          status: status as string | undefined,
          riskLevel: riskLevel as string | undefined,
        },
        include: {
          _count: {
            select: { cameras: true, alerts: true },
          },
          createdBy: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({ zones });
    } catch (error) {
      console.error('Get zones error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    return requireRole(['administrator', 'supervisor'])(async (req, res, user) => {
      try {
        const { name, type, riskLevel, area, capacity, detectionRules } = req.body;

        if (!name) {
          return res.status(400).json({ error: 'Zone name is required' });
        }

        const zone = await prisma.zone.create({
          data: {
            name,
            type: type || 'Machine Floor',
            riskLevel: riskLevel || 'medium',
            area: area || null,
            capacity: capacity || null,
            detectionRules: detectionRules || [],
            createdById: user.id,
          },
          include: {
            createdBy: {
              select: { id: true, name: true },
            },
          },
        });

        return res.status(201).json({ message: 'Zone created', zone });
      } catch (error) {
        console.error('Create zone error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);
