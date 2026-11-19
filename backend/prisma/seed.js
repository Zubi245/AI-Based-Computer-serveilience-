const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@texvision.ai' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@texvision.ai',
      password: passwordHash,
      role: 'administrator',
      status: 'active',
      permissions: JSON.stringify(['all']),
    },
  });

  // Create supervisor user
  const supervisorPasswordHash = await bcrypt.hash('super123', 10);
  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@texvision.ai' },
    update: {},
    create: {
      name: 'Site Supervisor',
      email: 'supervisor@texvision.ai',
      password: supervisorPasswordHash,
      role: 'supervisor',
      status: 'active',
      permissions: JSON.stringify(['cameras:read', 'cameras:write', 'alerts:read', 'alerts:write', 'zones:read', 'reports:read']),
    },
  });

  // Create viewer user
  const viewerPasswordHash = await bcrypt.hash('view123', 10);
  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@texvision.ai' },
    update: {},
    create: {
      name: 'Shift Viewer',
      email: 'viewer@texvision.ai',
      password: viewerPasswordHash,
      role: 'viewer',
      status: 'active',
      permissions: JSON.stringify(['cameras:read', 'alerts:read', 'zones:read', 'reports:read']),
    },
  });

  // Create zones
  const zones = await Promise.all([
    prisma.zone.create({
      data: {
        name: 'Loom Section',
        type: 'Machine Floor',
        riskLevel: 'high',
        area: 5000,
        capacity: 20,
        currentOccupancy: 12,
        status: 'active',
        detectionRules: JSON.stringify(['smoking', 'mobile', 'fire']),
        createdById: admin.id,
      },
    }),
    prisma.zone.create({
      data: {
        name: 'Restricted Zone',
        type: 'Restricted Access',
        riskLevel: 'critical',
        area: 2000,
        capacity: 5,
        currentOccupancy: 2,
        status: 'active',
        detectionRules: JSON.stringify(['unauthorized_entry', 'smoking', 'fire']),
        createdById: admin.id,
      },
    }),
    prisma.zone.create({
      data: {
        name: 'Warehouse',
        type: 'Warehouse',
        riskLevel: 'medium',
        area: 8000,
        capacity: 10,
        currentOccupancy: 6,
        status: 'active',
        detectionRules: JSON.stringify(['smoking', 'fire', 'unauthorized_entry']),
        createdById: admin.id,
      },
    }),
    prisma.zone.create({
      data: {
        name: 'Chemical Storage',
        type: 'Chemical Storage',
        riskLevel: 'critical',
        area: 1500,
        capacity: 3,
        currentOccupancy: 1,
        status: 'active',
        detectionRules: JSON.stringify(['smoking', 'fire', 'unauthorized_entry', 'mobile']),
        createdById: admin.id,
      },
    }),
    prisma.zone.create({
      data: {
        name: 'Production Line',
        type: 'Machine Floor',
        riskLevel: 'high',
        area: 6000,
        capacity: 25,
        currentOccupancy: 18,
        status: 'active',
        detectionRules: JSON.stringify(['smoking', 'sleeping', 'mobile', 'fire']),
        createdById: admin.id,
      },
    }),
  ]);

  // Create cameras
  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        name: 'Camera 01',
        zoneName: 'Loom Section',
        rtspUrl: 'rtsp://192.168.1.101:554/stream1',
        status: 'active',
        resolution: '1920x1080',
        fps: 30,
        health: 98,
        detectionTypes: JSON.stringify({ smoking: true, sleeping: false, fire: true, mobile: true, unethical: false }),
        zoneId: zones[0].id,
        createdById: admin.id,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 02',
        zoneName: 'Restricted Zone',
        rtspUrl: 'rtsp://192.168.1.102:554/stream1',
        status: 'active',
        resolution: '1920x1080',
        fps: 30,
        health: 95,
        detectionTypes: JSON.stringify({ smoking: true, sleeping: true, fire: false, mobile: false, unethical: true }),
        zoneId: zones[1].id,
        createdById: admin.id,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 03',
        zoneName: 'Warehouse',
        rtspUrl: 'rtsp://192.168.1.103:554/stream1',
        status: 'active',
        resolution: '1920x1080',
        fps: 25,
        health: 92,
        detectionTypes: JSON.stringify({ smoking: false, sleeping: false, fire: true, mobile: false, unethical: false }),
        zoneId: zones[2].id,
        createdById: admin.id,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 04',
        zoneName: 'Chemical Storage',
        rtspUrl: 'rtsp://192.168.1.104:554/stream1',
        status: 'active',
        resolution: '2560x1440',
        fps: 30,
        health: 97,
        detectionTypes: JSON.stringify({ smoking: true, sleeping: false, fire: true, mobile: false, unethical: true }),
        zoneId: zones[3].id,
        createdById: admin.id,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 05',
        zoneName: 'Production Line',
        rtspUrl: 'rtsp://192.168.1.105:554/stream1',
        status: 'active',
        resolution: '1920x1080',
        fps: 30,
        health: 99,
        detectionTypes: JSON.stringify({ smoking: false, sleeping: true, fire: false, mobile: true, unethical: false }),
        zoneId: zones[4].id,
        createdById: admin.id,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 06',
        zoneName: 'Supervisor Office',
        rtspUrl: 'rtsp://192.168.1.106:554/stream1',
        status: 'active',
        resolution: '1920x1080',
        fps: 25,
        health: 94,
        detectionTypes: JSON.stringify({ smoking: false, sleeping: false, fire: false, mobile: false, unethical: false }),
        createdById: admin.id,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 07',
        zoneName: 'Entrance Gate',
        rtspUrl: 'rtsp://192.168.1.107:554/stream1',
        status: 'active',
        resolution: '2560x1440',
        fps: 30,
        health: 96,
        detectionTypes: JSON.stringify({ smoking: false, sleeping: false, fire: false, mobile: false, unethical: true }),
        createdById: admin.id,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 08',
        zoneName: 'Dyeing Unit',
        rtspUrl: 'rtsp://192.168.1.108:554/stream1',
        status: 'maintenance',
        resolution: '1920x1080',
        fps: 30,
        health: 45,
        detectionTypes: JSON.stringify({ smoking: true, sleeping: true, fire: false, mobile: true, unethical: false }),
        createdById: admin.id,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 09',
        zoneName: 'Finishing Section',
        rtspUrl: 'rtsp://192.168.1.109:554/stream1',
        status: 'active',
        resolution: '1920x1080',
        fps: 25,
        health: 91,
        detectionTypes: JSON.stringify({ smoking: false, sleeping: false, fire: false, mobile: true, unethical: false }),
        createdById: admin.id,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 10',
        zoneName: 'Quality Control',
        rtspUrl: 'rtsp://192.168.1.110:554/stream1',
        status: 'active',
        resolution: '1920x1080',
        fps: 30,
        health: 93,
        detectionTypes: JSON.stringify({ smoking: false, sleeping: true, fire: false, mobile: false, unethical: false }),
        createdById: admin.id,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 11',
        zoneName: 'Parking Area',
        rtspUrl: 'rtsp://192.168.1.111:554/stream1',
        status: 'active',
        resolution: '1920x1080',
        fps: 20,
        health: 88,
        detectionTypes: JSON.stringify({ smoking: false, sleeping: false, fire: false, mobile: false, unethical: true }),
        createdById: admin.id,
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Camera 12',
        zoneName: 'Emergency Exit',
        rtspUrl: 'rtsp://192.168.1.112:554/stream1',
        status: 'inactive',
        resolution: '1920x1080',
        fps: 25,
        health: 0,
        detectionTypes: JSON.stringify({ smoking: false, sleeping: false, fire: true, mobile: false, unethical: false }),
        createdById: admin.id,
      },
    }),
  ]);

  console.log('Seed completed successfully');
  console.log(`Created: 3 users, ${zones.length} zones, ${cameras.length} cameras`);
  console.log('Demo credentials:');
  console.log('  Admin: admin@texvision.ai / admin123');
  console.log('  Supervisor: supervisor@texvision.ai / super123');
  console.log('  Viewer: viewer@texvision.ai / view123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
