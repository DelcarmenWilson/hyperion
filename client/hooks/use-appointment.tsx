import { FullAppointment, FullLeadNoConvo } from "@/types";
import { create } from "zustand";

type useAppointmentStore = {
  //APPOINTMENT FORM
  isFormOpen: boolean;
  onFormOpen: (e?: FullLeadNoConvo) => void;
  onFormClose: () => void;
  lead?: FullLeadNoConvo;
  //APPOINTMENT DETAILS
  isDetailsOpen: boolean;
  onDetailsOpen: (e: FullAppointment) => void;
  onDetailsClose: () => void;
  appointment?: FullAppointment;
};

export const useAppointment = create<useAppointmentStore>((set) => ({
  //APPOINTMENT FORM
  isFormOpen: false,
  onFormOpen: (e) => set({ isFormOpen: true, lead: e }),
  onFormClose: () => set({ isFormOpen: false }),

  //APPOINTMENT DETAILS
  isDetailsOpen: false,
  onDetailsOpen: (e) => set({ isDetailsOpen: true, appointment: e }),
  onDetailsClose: () => set({ isDetailsOpen: false }),
}));
