import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const token = req.cookies?.token;
  return token || null;
}

export async function getCurrentUser(req: NextApiRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      permissions: true,
      lastLogin: true,
    },
  });
}

export function requireAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: any) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Please log in' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Forbidden - Account is inactive' });
    }
    return handler(req, res, user);
  };
}

export function requireRole(allowedRoles: string[]) {
  return function (
    handler: (req: NextApiRequest, res: NextApiResponse, user: any) => Promise<void> | void
  ) {
    return requireAuth(async (req, res, user) => {
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
      }
      return handler(req, res, user);
    });
  };
}

export const ROLES = {
  ADMINISTRATOR: 'administrator',
  SUPERVISOR: 'supervisor',
  VIEWER: 'viewer',
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  administrator: ['all'],
  supervisor: ['cameras:read', 'cameras:write', 'alerts:read', 'alerts:write', 'zones:read', 'reports:read'],
  viewer: ['cameras:read', 'alerts:read', 'zones:read', 'reports:read'],
};
