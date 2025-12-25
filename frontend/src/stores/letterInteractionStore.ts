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
    const newUnlockedBlocks = new Set(state.unlockedBlocks);
    newUnlockedBlocks.add(blockId);
    return { unlockedBlocks: newUnlockedBlocks };
  }),

  isBlockUnlocked: (blockId: string) => {
    return get().unlockedBlocks.has(blockId);
  },

  reset: () => set({
    isEnvelopeOpen: false,
    unlockedBlocks: new Set<string>(),
  }),
}));
