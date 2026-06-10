import apiClient from './axiosConfig';

const maintenanceService = {
  getRequests: async () => {
    const response = await apiClient.get('/maintenance');
    return response.data;
  },
  getStats: async () => {
    const response = await apiClient.get('/maintenance/stats');
    return response.data;
  },
  createRequest: async (data) => {
    const response = await apiClient.post('/maintenance', data);
    return response.data;
  },
  updateStatus: async (id, data) => {
    const response = await apiClient.patch(`/maintenance/${id}/status`, data);
    return response.data;
  }
};

export default maintenanceService;
