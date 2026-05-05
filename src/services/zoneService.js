import { mockZones } from '../data/mockZones';

export const zoneService = {
  getAllZones: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockZones;
  },

  getZoneById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockZones.find(zone => zone.id === id);
  },

  addZone: async (zoneData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newZone = {
      id: `ZONE-${String(mockZones.length + 1).padStart(3, '0')}`,
      ...zoneData,
      status: 'active',
      currentOccupancy: 0,
    };
    mockZones.push(newZone);
    return newZone;
  },

  updateZone: async (id, zoneData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockZones.findIndex(zone => zone.id === id);
    if (index !== -1) {
      mockZones[index] = { ...mockZones[index], ...zoneData };
      return mockZones[index];
    }
    throw new Error('Zone not found');
  },

  deleteZone: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockZones.findIndex(zone => zone.id === id);
    if (index !== -1) {
      mockZones.splice(index, 1);
      return true;
    }
    throw new Error('Zone not found');
  },

  toggleZoneStatus: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const zone = mockZones.find(z => z.id === id);
    if (zone) {
      zone.status = zone.status === 'active' ? 'inactive' : 'active';
      return zone;
    }
    throw new Error('Zone not found');
  },
};
