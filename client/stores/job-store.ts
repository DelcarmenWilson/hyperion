import { create } from "zustand";
import { JobStatus } from "@/types/job";

type State = {
  status: JobStatus | string;
  sorted: boolean;
};
type Actions = {
  setStatus: (s: string) => void;
  toggleSorted: () => void;
};

export const useJobStore = create<State & Actions>((set, get) => ({
  status: JobStatus.IN_PROGRESS,
  sorted: false,
  setStatus: (s) => set({ status: s }),
  toggleSorted: () => set({ sorted: !get().sorted }),
}));
