import { create } from "zustand";
import { OnlineUser } from "@/types/user";

type State = {
  user?: OnlineUser;
  isLoginStatusOpen: boolean;
  onLoginStatusOpen: (u?: OnlineUser) => void;
  onLoginStatusClose: () => void;
};

export const useLoginStatusStore = create<State>((set) => ({
  isLoginStatusOpen: false,
  onLoginStatusOpen: (u?) => set({ user: u, isLoginStatusOpen: true }),
  onLoginStatusClose: () => set({ isLoginStatusOpen: false }),
}));