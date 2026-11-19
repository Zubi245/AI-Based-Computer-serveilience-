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
    const { type, startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (type === 'violations-by-category') {
      const alerts = await prisma.alert.groupBy({
        by: ['violationType'],
        where: dateFilter,
        _count: { violationType: true },
      });

      const data = alerts.map((item) => ({
        category: item.violationType,
        count: item._count.violationType,
      }));

      return res.status(200).json({ data });
    }

    if (type === 'zone-risk-comparison') {
      const zones = await prisma.zone.findMany({
        include: {
          _count: {
            select: { cameras: true, alerts: true },
          },
        },
      });

      const data = zones.map((zone) => ({
        zone: zone.name,
        riskLevel: zone.riskLevel,
        cameras: zone._count.cameras,
        alerts: zone._count.alerts,
      }));

      return res.status(200).json({ data });
    }

    if (type === 'camera-activity') {
      const cameras = await prisma.camera.findMany({
        include: {
          _count: {
            select: { alerts: true },
          },
        },
      });

      const data = cameras.map((camera) => ({
        camera: camera.name,
        status: camera.status,
        health: camera.health,
        alerts: camera._count.alerts,
      }));

      return res.status(200).json({ data });
    }

    if (type === 'weekly-trends') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const dailyAlerts = await prisma.alert.findMany({
        where: {
          createdAt: { gte: sevenDaysAgo },
        },
        select: {
          createdAt: true,
          status: true,
        },
      });

      const data = dailyAlerts.map((alert) => ({
        date: alert.createdAt.toISOString().split('T')[0],
        status: alert.status,
      }));

      return res.status(200).json({ data });
    }

    if (type === 'resolution-time') {
      const resolvedAlerts = await prisma.alert.findMany({
        where: {
          status: 'resolved',
          resolvedAt: { not: null },
          ...dateFilter,
        },
        select: {
          createdAt: true,
          resolvedAt: true,
        },
      });

      const data = resolvedAlerts.map((alert) => {
        const created = new Date(alert.createdAt).getTime();
        const resolved = new Date(alert.resolvedAt!).getTime();
        return {
          id: alert.id,
          resolutionMinutes: Math.round((resolved - created) / (1000 * 60)),
        };
      });

      return res.status(200).json({ data });
    }

    return res.status(400).json({ error: 'Invalid report type' });
  } catch (error) {
    console.error('Reports error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
