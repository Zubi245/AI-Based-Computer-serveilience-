import { mockUsers } from '../data/mockUsers';

export const userService = {
  getAllUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.map(({ password, ...user }) => user);
  },

  getUserById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers.find(u => u.id === id);
    if (user) {
      const { password, ...userData } = user;
      return userData;
    }
    return null;
  },

  addUser: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser = {
      id: `USR-${String(mockUsers.length + 1).padStart(3, '0')}`,
      ...userData,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      avatar: null,
    };
    mockUsers.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  updateUser: async (id, userData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...userData };
      const { password, ...userWithoutPassword } = mockUsers[index];
      return userWithoutPassword;
    }
    throw new Error('User not found');
  },

  deleteUser: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return true;
    }
    throw new Error('User not found');
  },

  toggleUserStatus: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const user = mockUsers.find(u => u.id === id);
    if (user) {
      user.status = user.status === 'active' ? 'inactive' : 'active';
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    throw new Error('User not found');
  },
};
