import apiClient from './axiosConfig';

const TenancyService = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') params.append(key, val);
        });
        return apiClient.get(`/tenancies?${params.toString()}`).then(r => r.data);
    },

    getById: (id) => apiClient.get(`/tenancies/${id}`).then(r => r.data),

    getStats: () => apiClient.get('/tenancies/stats').then(r => r.data),

    create: (payload) => apiClient.post('/tenancies', payload).then(r => r.data),

    terminate: (id, payload) => apiClient.patch(`/tenancies/${id}/terminate`, payload).then(r => r.data),
};

export default TenancyService;
