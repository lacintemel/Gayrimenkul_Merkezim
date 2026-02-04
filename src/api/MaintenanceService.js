import apiClient from './axiosConfig';

const maintenanceService = {
  getRequests: async () => {
    const response = await apiClient.get('/maintenance/requests');
    return response.data;
  },
  createRequest: async (data) => {
    const response = await apiClient.post('/maintenance/requests', data);
    return response.data;
  }
};

export default maintenanceService;
