import { Job, MiniJob } from "@prisma/client";
import { create } from "zustand";

type State = {
  job?:Job
  miniJob?:MiniJob
  jobFormIsOpen: boolean;
  miniJobFormIsOpen: boolean;
};
type Actions = {
  setJob:(j:Job)=>void
  setMiniJob:(j:MiniJob)=>void
  onJobFormOpen: () => void;
  onJobFormClose: () => void;
  onMiniJobFormOpen: () => void;
  onMiniJobFormClose: () => void;
};

export const useJobStore = create<State & Actions>((set) => ({
  jobFormIsOpen: false,
  setJob:(j)=>set({ job: j }),
  setMiniJob:(j)=>set({ miniJob: j }),
  onJobFormOpen: () => set({ jobFormIsOpen: true }),
  onJobFormClose: () => set({ jobFormIsOpen: false,job:undefined }),
  miniJobFormIsOpen: false,
  onMiniJobFormOpen: () => set({ miniJobFormIsOpen: true }),
  onMiniJobFormClose: () => set({ miniJobFormIsOpen: false,miniJob:undefined }),
}));
