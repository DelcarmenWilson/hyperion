import { ScheduleDay } from "@/formulas/schedule";
import { FullAppointment, FullLeadNoConvo } from "@/types";
import { create } from "zustand";

type useScheduleBreakStore = {
  //SCHEDULE BREAK FORM
  isOpen: boolean;
  schedule?: ScheduleDay;
  onOpen: (schedule: ScheduleDay) => void;
  onClose: () => void;
};

export const useScheduleBreak = create<useScheduleBreakStore>((set) => ({
  //SCHEDULE BREAK FORM
  isOpen: false,
  onOpen: (s) => set({ schedule: s, isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
