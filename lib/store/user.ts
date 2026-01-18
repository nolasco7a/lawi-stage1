import type { User } from "next-auth";
import { create } from "zustand";

type State = {
  user: User | null;
};

type Action = {
  setUser: (user: User | null) => void;
};

export const useUserStore = create<State & Action>((set) => ({
  // MARK: states
  user: null,

  // MARK: actions
  setUser: (user: User | null) => set({ user }),
}));

export const selectIsGuest = (state: State) => !state.user || state.user.type === "guest";
