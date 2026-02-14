import apiClient from './axiosConfig';

const PropertyService = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') params.append(key, val);
        });
        return apiClient.get(`/properties?${params.toString()}`).then(r => r.data);
    },

    getById: (id) => apiClient.get(`/properties/${id}`).then(r => r.data),

    getStats: () => apiClient.get('/properties/stats').then(r => r.data),

    getFeatures: () => apiClient.get('/properties/features/all').then(r => r.data),
};

export default PropertyService;
