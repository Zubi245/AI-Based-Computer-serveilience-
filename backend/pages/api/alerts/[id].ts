import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Alert ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const alert = await prisma.alert.findUnique({
        where: { id },
        include: {
          camera: true,
          zone: true,
          acknowledgedByUser: {
            select: { id: true, name: true, email: true },
          },
          resolvedByUser: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!alert) {
        return res.status(404).json({ error: 'Alert not found' });
      }

      return res.status(200).json({ alert });
    } catch (error) {
      console.error('Get alert error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { status, acknowledged, notes, resolvedBy } = req.body;

      const updateData: any = {};

      if (status) updateData.status = status;
      if (acknowledged !== undefined) updateData.acknowledged = acknowledged;
      if (notes !== undefined) updateData.notes = notes;

      if (acknowledged && !updateData.acknowledgedBy) {
        updateData.acknowledgedBy = user.id;
        updateData.acknowledgedAt = new Date();
      }

      if (status === 'resolved') {
        updateData.resolvedBy = user.id;
        updateData.resolvedAt = new Date();
      }

      const alert = await prisma.alert.update({
        where: { id },
        data: updateData,
        include: {
          camera: true,
          zone: true,
        },
      });

      return res.status(200).json({ message: 'Alert updated', alert });
    } catch (error) {
      console.error('Update alert error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    return requireRole(['administrator'])(async (req, res, user) => {
      try {
        await prisma.alert.delete({
          where: { id },
        });

        return res.status(200).json({ message: 'Alert deleted' });
      } catch (error) {
        console.error('Delete alert error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);
