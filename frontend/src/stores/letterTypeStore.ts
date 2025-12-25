/**
 * Letter Type store using Zustand
 */
import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { LetterType, CreateLetterTypeRequest } from '../types/index';

interface LetterTypeState {
  letterTypes: LetterType[];
  isLoading: boolean;
  error: string | null;
  fetchLetterTypes: () => Promise<void>;
  createLetterType: (data: CreateLetterTypeRequest) => Promise<void>;
  updateLetterType: (id: string, data: CreateLetterTypeRequest) => Promise<void>;
  deleteLetterType: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useLetterTypeStore = create<LetterTypeState>((set) => ({
  letterTypes: [],
  isLoading: false,
  error: null,

  fetchLetterTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const letterTypes = await apiClient.getLetterTypes();
      set({ letterTypes, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch letter types',
        isLoading: false,
      });
    }
  },

  createLetterType: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const letterType = await apiClient.createLetterType(data);
      set((state) => ({
        letterTypes: [...state.letterTypes, letterType],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to create letter type',
        isLoading: false,
      });
      throw error;
    }
  },

  updateLetterType: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const letterType = await apiClient.updateLetterType(id, data);
      set((state) => ({
        letterTypes: state.letterTypes.map((lt) => (lt.id === id ? letterType : lt)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to update letter type',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteLetterType: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteLetterType(id);
      set((state) => ({
        letterTypes: state.letterTypes.filter((lt) => lt.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to delete letter type',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
