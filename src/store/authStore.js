import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../api/authService';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,

      login: async (email, password) => {
        try {
          set({ loading: true });
          const { user, accessToken } = await authService.login(email, password);
          set({
            user,
            accessToken,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true };
        } catch (error) {
          set({ loading: false });
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ isAuthenticated: false, loading: false });
          return;
        }

        try {
          set({ loading: true });
          const user = await authService.getCurrentUser();
          set({
            user,
            accessToken: token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);