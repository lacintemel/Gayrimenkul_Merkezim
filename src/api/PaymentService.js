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
  getSummary: async () => {
    const response = await apiClient.get('/payments/summary/stats');
    return response.data;
  },
  payPayment: async (paymentId, payload = {}) => {
    const response = await apiClient.patch(`/payments/${paymentId}/pay`, payload);
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
