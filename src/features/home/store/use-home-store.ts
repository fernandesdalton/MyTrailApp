import { create } from 'zustand';

type HomeStore = {
  onboardingDone: boolean;
  markOnboardingDone: () => void;
};

export const useHomeStore = create<HomeStore>((set) => ({
  onboardingDone: false,
  markOnboardingDone: () => set({ onboardingDone: true }),
}));
