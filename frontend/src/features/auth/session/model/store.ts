import { create } from "zustand";

type AuthUiState = {
  isLoading: boolean;
  errorMessage: string | null;
  setLoading: (loading: boolean) => void;
  setError: (message: string) => void;
  reset: () => void;
};

export const useAuthUiStore = create<AuthUiState>((set) => ({
  isLoading: false,
  errorMessage: null,
  setLoading: (isLoading) => set({ isLoading }),
  setError: (errorMessage) => set({ errorMessage }),
  reset: () => set({ isLoading: false, errorMessage: null }),
}));
