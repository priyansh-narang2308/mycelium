import { create } from "zustand";
import type { Recommendation, Challenge } from "@/lib/types";
import { CHALLENGES } from "@/lib/constants/challenges";

interface AIState {
  recommendations: Recommendation[];
  challenges: Challenge[];
  insight: string | null;
  isProcessing: boolean;
  setRecommendations: (recs: Recommendation[]) => void;
  setInsight: (insight: string) => void;
  setIsProcessing: (status: boolean) => void;
  toggleChallenge: (id: string) => void;
  resetChallenges: () => void;
}

const initialChallenges: Challenge[] = CHALLENGES.map((challenge) => ({
  ...challenge,
  active: false,
  streak: 0,
  completed: false,
}));

export const useAIStore = create<AIState>((set) => ({
  recommendations: [],
  challenges: initialChallenges,
  insight: null,
  isProcessing: false,

  setRecommendations: (recs) => set({ recommendations: recs }),
  setInsight: (insight) => set({ insight }),
  setIsProcessing: (status) => set({ isProcessing: status }),

  toggleChallenge: (id) =>
    set((state) => ({
      challenges: state.challenges.map((challenge) =>
        challenge.id === id
          ? { ...challenge, active: !challenge.active, streak: !challenge.active ? challenge.streak + 1 : challenge.streak }
          : challenge,
      ),
    })),

  resetChallenges: () => set({ challenges: initialChallenges }),
}));