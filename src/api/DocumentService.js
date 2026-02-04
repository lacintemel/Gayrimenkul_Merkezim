import apiClient from './axiosConfig';

const documentService = {
  getDocuments: async () => {
    const response = await apiClient.get('/documents');
    return response.data;
  },
  uploadDocument: async (file, metadata) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => formData.append(key, metadata[key]));
    const response = await apiClient.post('/documents', formData);
    return response.data;
  },
  deleteDocument: async (id) => {
    const response = await apiClient.delete(`/documents/${id}`);
    return response.data;
  }
};

export default documentService;
