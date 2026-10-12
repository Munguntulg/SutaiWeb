import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        if (token) {
          Cookies.set('token', token, { expires: 7, sameSite: 'strict' });
        } else {
          Cookies.remove('token');
        }
      },

      login: (token, user) => {
        Cookies.set('token', token, { expires: 7, sameSite: 'strict' });
        set({ token, user });
      },

      logout: async () => {
        try {
          await api.post('/logout');
        } catch {
          // ignore
        }
        Cookies.remove('token');
        set({ token: null, user: null });
      },

      fetchMe: async () => {
        const token = Cookies.get('token') || get().token;
        if (!token) return;
        set({ isLoading: true });
        try {
          const res = await api.get('/me');
          set({ user: res.data, token });
        } catch {
          Cookies.remove('token');
          set({ user: null, token: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
