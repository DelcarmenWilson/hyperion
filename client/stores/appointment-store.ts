
import { create } from "zustand";

import { FullAppointment } from "@/types";
import { AppointmentStatus } from "@/types/appointment"


type State = {
  appointment?: FullAppointment;
  //APPOINTMENT FORM
  isAppointmentFormOpen: boolean;
  //APPOINTMENT DETAILS
  isDetailsOpen: boolean;
  status: string;
};
type Actions = {
  //APPOINTMENT FORM
  onAppointmentFormOpen: () => void;
  onApointmentFormClose: () => void;
  //APPOINTMENT DETAILS
  onDetailsOpen: (e: FullAppointment) => void;
  onDetailsClose: () => void;
  onSetStatus: (s: string) => void;
};

export const useAppointmentStore = create<State & Actions>((set) => ({
  //APPOINTMENT FORM
  isAppointmentFormOpen: false,
  onAppointmentFormOpen: () => set({ isAppointmentFormOpen: true }),
  onApointmentFormClose: () => set({ isAppointmentFormOpen: false }),

  //APPOINTMENT DETAILS
  isDetailsOpen: false,
  onDetailsOpen: (e) => set({ isDetailsOpen: true, appointment: e }),
  onDetailsClose: () => set({ isDetailsOpen: false }),

  // to store status value(default will be scheduled)
  status: AppointmentStatus.SCHEDULED,
  onSetStatus: (s) => set({ status: s }),
}));