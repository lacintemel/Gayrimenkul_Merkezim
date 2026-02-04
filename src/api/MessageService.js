import apiClient from './axiosConfig';

const messageService = {
  getConversations: async () => {
    const response = await apiClient.get('/messages/conversations');
    return response.data;
  },
  getMessages: async (conversationId) => {
    const response = await apiClient.get(`/messages/${conversationId}`);
    return response.data;
  },
  sendMessage: async (conversationId, content) => {
    const response = await apiClient.post(`/messages/${conversationId}`, { content });
    return response.data;
  }
};

export default messageService;
