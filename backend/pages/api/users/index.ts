import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  if (req.method === 'GET') {
    try {
      const { role, status, search } = req.query;

      const users = await prisma.user.findMany({
        where: {
          role: role as string | undefined,
          status: status as string | undefined,
          name: search ? { contains: search as string } : undefined,
          email: search ? { contains: search as string } : undefined,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          permissions: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { cameras: true, zones: true, alerts: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    return requireRole(['administrator'])(async (req, res, user) => {
      try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
          return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return res.status(409).json({ error: 'User already exists with this email' });
        }

        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: passwordHash,
            role: role || 'viewer',
            status: 'active',
            permissions: role === 'administrator' ? JSON.stringify(['all']) : JSON.stringify([]),
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
          },
        });

        return res.status(201).json({ message: 'User created successfully', user: newUser });
      } catch (error) {
        console.error('Create user error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res, user);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);
