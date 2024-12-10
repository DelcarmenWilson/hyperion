import { create } from "zustand";
import { FeedbackStatus } from "@/types/feedback";

type State = {
  status: FeedbackStatus | string;
  agent: string;
  page: string;
  sorted: boolean;
};
type Actions = {
  setStatus: (s: string) => void;
  setAgent: (a: string) => void;
  setPage: (a: string) => void;
  toggleSorted: () => void;
};

export const useFeedbackStore = create<State & Actions>((set, get) => ({
  status: FeedbackStatus.PENDING,
  agent: "All",
  page: "All",
  sorted: false,
  setStatus: (s) => set({ status: s }),
  setAgent: (a) => set({ agent: a }),
  setPage: (p) => set({ page: p }),
  toggleSorted: () => set({ sorted: !get().sorted }),
}));
