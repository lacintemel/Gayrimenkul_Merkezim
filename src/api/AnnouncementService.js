import apiClient from './axiosConfig';

const announcementService = {
  getAnnouncements: async () => {
    const response = await apiClient.get('/announcements');
    return response.data;
  },
  getStats: async () => {
    const response = await apiClient.get('/announcements/stats');
    return response.data;
  },
  createAnnouncement: async (data) => {
    const response = await apiClient.post('/announcements', data);
    return response.data;
  },
  markRead: async (id, data = {}) => {
    const response = await apiClient.patch(`/announcements/${id}/read`, data);
    return response.data;
  },
};

export default announcementService;
