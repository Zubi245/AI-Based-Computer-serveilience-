import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import recordingService from '@/services/recordingService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads/snapshots');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const cameraId = req.body.cameraId || 'unknown';
    const cameraDir = path.join(uploadDir, cameraId);
    if (!fs.existsSync(cameraDir)) {
      fs.mkdirSync(cameraDir, { recursive: true });
    }
    cb(null, cameraDir);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    cb(null, `alert_${timestamp}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Wrapper to run multer then handler
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: any
) {
  if (req.method === 'GET') {
    try {
      const { severity, status, cameraId, zoneId, startDate, endDate, page = '1', limit = '50' } = req.query;

      const where: any = {};

      if (severity) where.severity = severity as string;
      if (status) where.status = status as string;
      if (cameraId) where.cameraId = cameraId as string;
      if (zoneId) where.zoneId = zoneId as string;
      if (startDate && endDate) {
        where.timestamp = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      const [alerts, total] = await Promise.all([
        prisma.alert.findMany({
          where,
          include: {
            camera: {
              select: { id: true, name: true, zoneName: true },
            },
            zone: {
              select: { id: true, name: true },
            },
            acknowledgedByUser: {
              select: { id: true, name: true, email: true },
            },
            resolvedByUser: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (parseInt(page as string) - 1) * parseInt(limit as string),
          take: parseInt(limit as string),
        }),
        prisma.alert.count({ where }),
      ]);

      return res.status(200).json({
        alerts,
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      });
    } catch (error) {
      console.error('Get alerts error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      // Parse multipart form data
      await runMiddleware(req, res, upload.single('snapshot'));

      const {
        cameraId,
        zoneId,
        violationType,
        violationLabel,
        severity,
        confidence,
      } = req.body;

      if (!cameraId || !violationType || !violationLabel || !severity) {
        // Delete uploaded file if validation fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Save snapshot to storage service (only if file uploaded)
      let snapshotPath = null;
      if (req.file) {
        const snapshotResult = recordingService.saveSnapshot(
          cameraId as string,
          'temp', // alertId not known yet, will update after DB insert
          fs.readFileSync(req.file.path),
          req.file.filename
        );
        if (snapshotResult.success) {
          snapshotPath = snapshotResult.relativePath;
        }
      }

      // Create alert in database
      const alert = await prisma.alert.create({
        data: {
          cameraId: cameraId as string,
          zoneId: zoneId || null,
          violationType: violationType as string,
          violationLabel: violationLabel as string,
          severity: severity as string,
          confidence: confidence ? parseFloat(confidence as string) : 0.85,
          snapshot: snapshotPath || null,
          status: 'active',
        },
        include: {
          camera: {
            select: { id: true, name: true, zoneName: true },
          },
        },
      });

      // If snapshot was saved, we could update the filename with actual alert ID
      // For now, the path is stored as-is

      return res.status(201).json({ message: 'Alert created', alert, snapshot: snapshotPath });
    } catch (error: any) {
      console.error('Create alert error:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default requireAuth(handler);
