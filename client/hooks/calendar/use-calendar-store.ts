import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Appointment, AppointmentLabel, Schedule } from "@prisma/client";

import dayjs from "dayjs";
import { CalendarAppointment } from "@/types/appointment";
import { scheduleGet } from "@/actions/user/schedule";
import {
  getAppointmentLabels,
  getAppointmentsTest,
} from "@/actions/appointment";

type State = {
  appointments?: CalendarAppointment[];
  selectedAppointment?: CalendarAppointment;
  labels?: AppointmentLabel[];
  selectedLabel?: AppointmentLabel;
  schedule?: Schedule;
  //MODALS
  showAppointmentModal: boolean;
  showLabelModal: boolean;
  setShowAppointmentModal: (s: boolean) => void;
  setShowLabelModal: (s: boolean) => void;
  //CALENDAER
  monthIndex: number;
  smallCalendarMonth: number;
  daySelected: dayjs.Dayjs;
};
type Actions = {
  //APPOINTMENTS
  setSelectedAppointment: (e: CalendarAppointment) => void;
  addAppointment: (e: CalendarAppointment) => void;
  updateAppointment: (e: CalendarAppointment) => void;
  //LABELS
  setSelectedLabel: (e: AppointmentLabel) => void;
  addLabel: (e: AppointmentLabel) => void;
  updateLabel: (e: AppointmentLabel) => void;
  setMonthIndex: (e: number) => void;
  setSmallCalendarMonth: (e: number) => void;
  setDaySelected: (e: dayjs.Dayjs) => void;
  fetchData: () => void;
};

export const useCalendarStore = create<State & Actions>()(
  immer((set) => ({
    //APPOINTMENTS
    setSelectedAppointment: (e) => set({ selectedAppointment: e }),
    addAppointment: (e) =>
      set((state) => {
        state.appointments?.push(e);
      }),
    updateAppointment: (e) =>
      set((state) => {
        state.appointments = state.appointments?.map((a) => {
          if (a.id == e.id) return e;
          return a;
        });
      }),
    //LABELS
    setSelectedLabel: (e) => set({ selectedLabel: e }),
    addLabel: (e) =>
      set((state) => {
        state.labels?.push(e);
      }),
    updateLabel: (e) =>
      set((state) => {
        state.labels = state.labels?.map((a) => {
          if (a.id == e.id) return e;
          return a;
        });
      }),
    //   MODALS
    showAppointmentModal: false,
    showLabelModal: false,
    setShowAppointmentModal: (s) => set({ showAppointmentModal: s }),
    setShowLabelModal: (s) => set({ showLabelModal: s }),
    // CALENDAR
    monthIndex: dayjs().month(),
    smallCalendarMonth: dayjs().month(),
    daySelected: dayjs(),
    setMonthIndex: (e) => set({ monthIndex: e }),
    setSmallCalendarMonth: (e) => set({ smallCalendarMonth: e }),
    setDaySelected: (e) => set({ daySelected: e }),
    fetchData: async () => {
      const schedule = await scheduleGet();
      const appointments = await getAppointmentsTest();
      const labels = await getAppointmentLabels();
      set({
        appointments: appointments,
        labels: labels,
        schedule: schedule!,
      });
    },
  }))
);
