// src/store/useManagerStore.ts
import { create } from 'zustand';

export interface ManagerStats {
  level: number;
  experience: number;
  maxExperience: number;
  onboardingProgress: number; // 0-100
  completedOnboardingSteps: number;
  totalOnboardingSteps: number;
  totalCalls: number;
  totalChats: number;
  totalOrders: number;
  rating: number; // 1-5 stars
}

interface ManagerState {
  stats: ManagerStats;
  addExperience: (amount: number) => void;
  completeOnboardingStep: () => void;
  updateStats: (updates: Partial<ManagerStats>) => void;
}

const initialState: ManagerStats = {
  level: 1,
  experience: 0,
  maxExperience: 100,
  onboardingProgress: 0,
  completedOnboardingSteps: 0,
  totalOnboardingSteps: 6,
  totalCalls: 0,
  totalChats: 0,
  totalOrders: 0,
  rating: 3.5,
};

export const useManagerStore = create<ManagerState>((set) => ({
  stats: initialState,

  addExperience: (amount) =>
    set((state) => {
      const newExperience = state.stats.experience + amount;
      const newLevel = Math.floor(newExperience / state.stats.maxExperience) + 1;
      const newMaxExperience = newLevel * 100;

      return {
        stats: {
          ...state.stats,
          experience: newExperience,
          level: newLevel,
          maxExperience: newMaxExperience,
        },
      };
    }),

  completeOnboardingStep: () =>
    set((state) => {
      const newCompleted = Math.min(
        state.stats.completedOnboardingSteps + 1,
        state.stats.totalOnboardingSteps
      );
      const progress = Math.round((newCompleted / state.stats.totalOnboardingSteps) * 100);

      return {
        stats: {
          ...state.stats,
          completedOnboardingSteps: newCompleted,
          onboardingProgress: progress,
        },
      };
    }),

  updateStats: (updates) =>
    set((state) => ({
      stats: { ...state.stats, ...updates },
    })),
}));