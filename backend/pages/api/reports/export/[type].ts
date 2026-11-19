import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { type } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { format = 'pdf', startDate, endDate } = req.body;

    if (type === 'alerts') {
      const where: any = {};
      if (startDate && endDate) {
        where.createdAt = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      const alerts = await prisma.alert.findMany({
        where,
        include: {
          camera: { select: { name: true, zoneName: true } },
          zone: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (format === 'csv') {
        const csvHeaders = 'ID,Camera,Zone,Violation,Severity,Confidence,Status,Timestamp\n';
        const csvRows = alerts.map((a) =>
          `${a.id},${a.camera?.name || 'N/A'},${a.zone?.name || 'N/A'},${a.violationLabel},${a.severity},${a.confidence},${a.status},${a.createdAt}`
        ).join('\n');
        const csvContent = csvHeaders + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="alerts-${new Date().toISOString().split('T')[0]}.csv"`);
        return res.status(200).send(csvContent);
      } else {
        const doc = new jsPDF();
        doc.text('Alerts Report', 20, 20);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);

        const tableData = alerts.map((a) => [
          a.id,
          a.camera?.name || 'N/A',
          a.zone?.name || 'N/A',
          a.violationLabel,
          a.severity,
          a.confidence.toString(),
          a.status,
          new Date(a.createdAt).toLocaleString(),
        ]);

        // @ts-ignore
        doc.autoTable({
          head: [['ID', 'Camera', 'Zone', 'Violation', 'Severity', 'Confidence', 'Status', 'Timestamp']],
          body: tableData,
          startY: 40,
        });

        const pdfBuffer = doc.output('arraybuffer');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="alerts-${new Date().toISOString().split('T')[0]}.pdf"`);
        return res.status(200).send(Buffer.from(pdfBuffer));
      }
    }

    if (type === 'cameras') {
      const cameras = await prisma.camera.findMany({
        include: { zone: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      });

      if (format === 'csv') {
        const csvHeaders = 'ID,Name,Zone,RTSP URL,Status,Health,Resolution,FPS\n';
        const csvRows = cameras.map((c) =>
          `${c.id},${c.name},${c.zone?.name || 'Unassigned'},${c.rtspUrl},${c.status},${c.health}%,${c.resolution},${c.fps}`
        ).join('\n');
        const csvContent = csvHeaders + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="cameras-${new Date().toISOString().split('T')[0]}.csv"`);
        return res.status(200).send(csvContent);
      } else {
        const doc = new jsPDF();
        doc.text('Cameras Report', 20, 20);

        const tableData = cameras.map((c) => [
          c.id,
          c.name,
          c.zone?.name || 'Unassigned',
          c.status,
          c.health + '%',
          c.resolution,
        ]);

        // @ts-ignore
        doc.autoTable({
          head: [['ID', 'Name', 'Zone', 'Status', 'Health', 'Resolution']],
          body: tableData,
          startY: 40,
        });

        const pdfBuffer = doc.output('arraybuffer');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="cameras-${new Date().toISOString().split('T')[0]}.pdf"`);
        return res.status(200).send(Buffer.from(pdfBuffer));
      }
    }

    if (type === 'zones') {
      const zones = await prisma.zone.findMany({
        include: {
          _count: { select: { cameras: true, alerts: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (format === 'csv') {
        const csvHeaders = 'ID,Name,Type,Risk Level,Capacity,Occupancy,Status,Cameras,Alerts\n';
        const csvRows = zones.map((z) =>
          `${z.id},${z.name},${z.type},${z.riskLevel},${z.capacity || 'N/A'},${z.currentOccupancy},${z.status},${z._count.cameras},${z._count.alerts}`
        ).join('\n');
        const csvContent = csvHeaders + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="zones-${new Date().toISOString().split('T')[0]}.csv"`);
        return res.status(200).send(csvContent);
      } else {
        const doc = new jsPDF();
        doc.text('Zones Report', 20, 20);

        const tableData = zones.map((z) => [
          z.id,
          z.name,
          z.type,
          z.riskLevel,
          z.status,
          z._count.cameras.toString(),
          z._count.alerts.toString(),
        ]);

        // @ts-ignore
        doc.autoTable({
          head: [['ID', 'Name', 'Type', 'Risk Level', 'Status', 'Cameras', 'Alerts']],
          body: tableData,
          startY: 40,
        });

        const pdfBuffer = doc.output('arraybuffer');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="zones-${new Date().toISOString().split('T')[0]}.pdf"`);
        return res.status(200).send(Buffer.from(pdfBuffer));
      }
    }

    return res.status(400).json({ error: 'Invalid export type' });
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default requireAuth(handler);
