import apiClient from './axiosConfig';

const UnitService = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') params.append(key, val);
        });
        return apiClient.get(`/units?${params.toString()}`).then(r => r.data);
    },

    getById: (id) => apiClient.get(`/units/${id}`).then(r => r.data),

    create: (payload) => apiClient.post('/units', payload).then(r => r.data),

    getStats: () => apiClient.get('/units/stats').then(r => r.data),
};

export default UnitService;
