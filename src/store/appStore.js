import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import maintenanceService from '../api/MaintenanceService';
import paymentService from '../api/PaymentService';
import announcementService from '../api/AnnouncementService';

export const useAppStore = create(
  persist(
    (set) => ({
      maintenanceRequests: [],
      payments: [],
      announcements: [],
      loading: false,
      error: null,

      fetchMaintenanceRequests: async () => {
        set({ loading: true, error: null });
        try {
          const data = await maintenanceService.getRequests();
          set({ maintenanceRequests: data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      fetchPayments: async () => {
        set({ loading: true, error: null });
        try {
          const data = await paymentService.getPayments();
          set({ payments: data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      fetchAnnouncements: async () => {
        set({ loading: true, error: null });
        try {
          const data = await announcementService.getAnnouncements();
          set({ announcements: data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
    }),
    { name: 'app-store' }
  )
);
