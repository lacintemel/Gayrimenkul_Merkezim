import apiClient from './axiosConfig';

const ReportService = {
  getFinancial: async () => {
    const response = await apiClient.get('/reports/financial');
    return response.data;
  },
  getOccupancy: async () => {
    const response = await apiClient.get('/reports/occupancy');
    return response.data;
  },
  getPayments: async () => {
    const response = await apiClient.get('/reports/payments');
    return response.data;
  },
};

export default ReportService;
