/**
 * Letter store using Zustand
 */
import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { Letter, LetterPublic, CreateLetterRequest, UpdateLetterRequest } from '../types';

interface LetterState {
  currentLetter: Letter | LetterPublic | null;
  letters: Letter[];
  isLoading: boolean;
  error: string | null;
  fetchLetter: (id: string) => Promise<void>;
  fetchPublicLetter: (slug: string) => Promise<void>;
  fetchLetters: () => Promise<void>;
  createLetter: (data: CreateLetterRequest) => Promise<void>;
  updateLetter: (id: string, data: UpdateLetterRequest) => Promise<void>;
  deleteLetter: (id: string) => Promise<void>;
  clearCurrentLetter: () => void;
  clearError: () => void;
}

export const useLetterStore = create<LetterState>((set) => ({
  currentLetter: null,
  letters: [],
  isLoading: false,
  error: null,

  fetchLetter: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const letter = await apiClient.getLetter(id);
      set({ currentLetter: letter, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch letter',
        isLoading: false,
      });
    }
  },

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

  fetchLetters: async () => {
    set({ isLoading: true, error: null });
    try {
      const letters = await apiClient.getLetters();
      set({ letters, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch letters',
        isLoading: false,
      });
    }
  },

  createLetter: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const letter = await apiClient.createLetter(data);
      set((state) => ({
        letters: [letter, ...state.letters],
        currentLetter: letter,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to create letter',
        isLoading: false,
      });
      throw error;
    }
  },

  updateLetter: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const letter = await apiClient.updateLetter(id, data);
      set((state) => ({
        letters: state.letters.map((l) => (l.id === id ? letter : l)),
        currentLetter: letter,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to update letter',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteLetter: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteLetter(id);
      set((state) => ({
        letters: state.letters.filter((l) => l.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to delete letter',
        isLoading: false,
      });
      throw error;
    }
  },

  clearCurrentLetter: () => set({ currentLetter: null }),

  clearError: () => set({ error: null }),
}));
