import apiClient from './axiosConfig';

const announcementService = {
  getAnnouncements: async () => {
    const response = await apiClient.get('/announcements');
    return response.data;
  }
};

export default announcementService;
