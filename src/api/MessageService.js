import apiClient from './axiosConfig';

const messageService = {
  getConversations: async () => {
    const response = await apiClient.get('/messages');
    return response.data;
  },
  getMessages: async (conversationId) => {
    const response = await apiClient.get(`/messages/${conversationId}`);
    return response.data;
  },
  sendMessage: async (conversationId, text) => {
    const response = await apiClient.post(`/messages/${conversationId}/messages`, { text });
    return response.data;
  },
  createConversation: async (recipient, message) => {
    const response = await apiClient.post('/messages', { recipient, message });
    return response.data;
  },
  markAsRead: async (conversationId) => {
    const response = await apiClient.patch(`/messages/${conversationId}/read`);
    return response.data;
  }
};

export default messageService;
