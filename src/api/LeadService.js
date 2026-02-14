import apiClient from './axiosConfig';

const LeadService = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') params.append(key, val);
        });
        return apiClient.get(`/leads?${params.toString()}`).then(r => r.data);
    },

    getPipeline: () => apiClient.get('/leads/pipeline').then(r => r.data),

    getStats: () => apiClient.get('/leads/stats').then(r => r.data),

    getById: (id) => apiClient.get(`/leads/${id}`).then(r => r.data),

    getActivities: (id) => apiClient.get(`/leads/${id}/activities`).then(r => r.data),
};

export default LeadService;
