"use client";
import { createContext, useContext, useEffect, useState } from "react";

import { AppointmentModal } from "@/components/modals/appointment-modal";
import { Appointment, Schedule } from "@prisma/client";
// import { useCurrentUser } from "@/hooks/use-current-user";
// import axios from "axios";

type AppointmentContextProviderProps = {
  initSchedule: Schedule;
  initAppointments: Appointment[];
  children: React.ReactNode;
};
type AppointmentContext = {
  schedule: Schedule | null;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule | null>>;
  appointments: Appointment[] | null;
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[] | null>>;
};
export const AppointmentContext = createContext<AppointmentContext | null>(
  null
);
export default function AppointmentProvider({
  initSchedule,
  initAppointments,
  children,
}: AppointmentContextProviderProps) {
  const [schedule, setSchedule] = useState<Schedule | null>(initSchedule);
  const [appointments, setAppointments] = useState<Appointment[] | null>(
    initAppointments
  );
  // const user = useCurrentUser();

  // useEffect(() => {
  //   const intialData = async () => {
  //     if (!user) return;
  //     const scdResponse = await axios.post("/api/user/schedule", {
  //       user: user?.id,
  //     });
  //     const scdData = await scdResponse.data;
  //     setSchedule(scdData);
  //     const appReponse = await axios.post("/api/user/appointments", {
  //       user: user?.id,
  //     });
  //     const appData = await appReponse.data;
  //     setAppointments(appData);
  //   };
  //   intialData();
  // }, []);

  return (
    <AppointmentContext.Provider
      value={{
        schedule,
        setSchedule,
        appointments,
        setAppointments,
      }}
    >
      {children}
      <AppointmentModal />
    </AppointmentContext.Provider>
  );
}

export function useAppointmentContext() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointmentContext must be used withing AppointmentContextProvider"
    );
  }
  return context;
}
