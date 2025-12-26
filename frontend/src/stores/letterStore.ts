/**
 * Letter store using Zustand
 */
import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { LetterPublic } from '../types/index';

interface LetterState {
  currentLetter: LetterPublic | null;
  isLoading: boolean;
  error: string | null;
  fetchPublicLetter: (slug: string) => Promise<void>;
  clearCurrentLetter: () => void;
  clearError: () => void;
}

export const useLetterStore = create<LetterState>((set) => ({
  currentLetter: null,
  isLoading: false,
  error: null,

  fetchPublicLetter: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const letter = await apiClient.getPublicLetter(slug);
      set({ currentLetter: letter, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Letter not found',
        isLoading: false,
      });
    }
  },

  clearCurrentLetter: () => set({ currentLetter: null }),

  clearError: () => set({ error: null }),
}));