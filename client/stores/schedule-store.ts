import { create } from "zustand";

import { ScheduleDay } from "@/formulas/schedule";

type State = {
  //SCHEDULE BREAK FORM
  isOpen: boolean;
  schedule?: ScheduleDay;
  onOpen: (schedule: ScheduleDay) => void;
  onClose: () => void;
};

export const useScheduleStore = create<State>((set) => ({
  //SCHEDULE BREAK FORM
  isOpen: false,
  onOpen: (s) => set({ schedule: s, isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
