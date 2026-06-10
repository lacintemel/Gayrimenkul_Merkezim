import apiClient from './axiosConfig';

const userService = {
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') params.append(key, val);
    });
    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  },
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.post('/users/change-password', { currentPassword, newPassword });
    return response.data;
  }
};

export default userService;
