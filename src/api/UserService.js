import apiClient from './axiosConfig';

const userService = {
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
