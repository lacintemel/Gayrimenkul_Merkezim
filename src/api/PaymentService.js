import apiClient from './axiosConfig';

const paymentService = {
  getPayments: async () => {
    const response = await apiClient.get('/payments');
    return response.data;
  },
  getUpcomingPayments: async () => {
    const response = await apiClient.get('/payments/upcoming');
    return response.data;
  },
  uploadReceipt: async (paymentId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/payments/${paymentId}/receipt`, formData);
    return response.data;
  }
};

export default paymentService;
