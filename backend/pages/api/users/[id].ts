import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const userData = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          permissions: true,
          lastLogin: true,
          createdAt: true,
          _count: {
            select: { cameras: true, zones: true, alerts: true },
          },
        },
      });

      if (!userData) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ user: userData });
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    return requireRole(['administrator'])(async (req, res, user) => {
      try {
        const { name, email, role, status, permissions } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (status) updateData.status = status;
        if (permissions !== undefined) {
          updateData.permissions = Array.isArray(permissions) ? JSON.stringify(permissions) : permissions;
        }

        const updatedUser = await prisma.user.update({
          where: { id },
          data: updateData,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            permissions: true,
            updatedAt: true,
          },
        });

        return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
      } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  if (req.method === 'DELETE') {
    return requireRole(['administrator'])(async (req, res, user) => {
      try {
        // Prevent self-deletion
        if (id === user.id) {
          return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await prisma.user.delete({
          where: { id },
        });

        return res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  if (req.method === 'PATCH') {
    return requireRole(['administrator'])(async (req, res, user) => {
      try {
        const { status } = req.body;

        if (!status || !['active', 'inactive'].includes(status)) {
          return res.status(400).json({ error: 'Valid status is required (active/inactive)' });
        }

        if (id === user.id && status === 'inactive') {
          return res.status(400).json({ error: 'Cannot deactivate your own account' });
        }

        const updatedUser = await prisma.user.update({
          where: { id },
          data: { status },
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        });

        return res.status(200).json({ message: 'User status updated', user: updatedUser });
      } catch (error) {
        console.error('Toggle user status error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);
