import { create } from 'zustand';

interface LetterInteractionState {
  isEnvelopeOpen: boolean;
  unlockedBlocks: Set<string>;

  // Actions
  openEnvelope: () => void;
  closeEnvelope: () => void;
  unlockBlock: (blockId: string) => void;
  isBlockUnlocked: (blockId: string) => boolean;
  reset: () => void;
}

export const useLetterInteractionStore = create<LetterInteractionState>((set, get) => ({
  isEnvelopeOpen: false,
  unlockedBlocks: new Set<string>(),

  openEnvelope: () => set({ isEnvelopeOpen: true }),

  closeEnvelope: () => set({ isEnvelopeOpen: false }),

  unlockBlock: (blockId: string) => set((state) => {
    if (!blockId) {
      console.warn('Attempted to unlock block with invalid ID:', blockId);
      return state; // Ignore invalid blockIds
    }
    console.log('Store: Unlocking block:', blockId);
    const newUnlockedBlocks = new Set(state.unlockedBlocks);
    newUnlockedBlocks.add(blockId);
    console.log('Store: Unlocked blocks after unlock:', Array.from(newUnlockedBlocks));
    return { unlockedBlocks: newUnlockedBlocks };
  }),

  isBlockUnlocked: (blockId: string) => {
    if (!blockId) return false; // Invalid blockIds are never unlocked
    const unlocked = get().unlockedBlocks.has(blockId);
    return unlocked;
  },

  reset: () => {
    console.log('Store: Resetting interaction state');
    return set({
      isEnvelopeOpen: false,
      unlockedBlocks: new Set<string>(),
    });
  },
}));
