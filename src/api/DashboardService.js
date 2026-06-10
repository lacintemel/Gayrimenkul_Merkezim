import apiClient from './axiosConfig';

const DashboardService = {
    getSummary: () => apiClient.get('/dashboard/summary').then(r => r.data),
};

export default DashboardService;
