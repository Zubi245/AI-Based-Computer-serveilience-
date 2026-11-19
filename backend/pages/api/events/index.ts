import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: any
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cameraId, zoneId, eventType, severity, startDate, endDate, page = '1', limit = '50' } = req.query;

    const where: any = {};

    if (cameraId) where.cameraId = cameraId as string;
    if (zoneId) where.zoneId = zoneId as string;
    if (eventType) where.eventType = eventType as string;
    if (severity) where.severity = severity as string;
    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const [events, total] = await Promise.all([
      prisma.eventLog.findMany({
        where,
        include: {
          camera: {
            select: { id: true, name: true },
          },
          zone: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
      prisma.eventLog.count({ where }),
    ]);

    return res.status(200).json({
      events,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string)),
    });
  } catch (error) {
    console.error('Get events error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
