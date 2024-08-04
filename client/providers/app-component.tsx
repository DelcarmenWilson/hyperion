"use client";
import React, { useState, useEffect, useReducer, useMemo } from "react";

import dayjs from "dayjs";
import {
  AppointmentContextProvider,
  AppointmentReducer,
  defaultAppointmentContextState,
} from "./app";
import { AppointmentDrawer } from "@/components/appointments/drawer";
import { Appointment, AppointmentLabel, Schedule } from "@prisma/client";
import { AppointmentDetails } from "@/components/appointments/details";

import { CalendarLabel } from "@/types";
import { appointmentLabelUpdateByChecked } from "@/actions/appointment";

type AppointmentContextComponentProps = {
  initSchedule: Schedule;
  initAppointments: Appointment[];
  initLabels: AppointmentLabel[];
  children: React.ReactNode;
};
function AppointmentContextComponent({
  initSchedule,
  initAppointments,
  initLabels,
  children,
}: AppointmentContextComponentProps) {
  const [schedule, setSchedule] = useState(initSchedule);
  const [appointments, setAppointments] = useState(initAppointments);
  const [userLabels, setUserLabels] = useState(initLabels);
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(dayjs().month());
  const [daySelected, setDaySelected] = useState(dayjs());
  //APPOINTMENTS
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  //LABLES
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<AppointmentLabel | null>(
    null
  );
  const [context, dispatchCalAppointment] = useReducer(AppointmentReducer, {
    ...defaultAppointmentContextState,
    schedule: initSchedule,
    appointments: initAppointments,
    userLabels: initLabels,
  });

  const filteredAppointments = useMemo(() => {
    return context.appointments!.filter((evt) =>
      userLabels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.color)
        .includes(evt.label)
    );
  }, [context, userLabels, initAppointments]);

  const updateLabel = (label: AppointmentLabel) => {
    //@ts-ignore
    appointmentLabelUpdateByChecked(label);
    setUserLabels(
      userLabels.map((lbl) => (lbl.name === label.name ? label : lbl))
    );
  };

  // useEffect(() => {
  //   //@ts-ignore
  //   setUserLabels((prevLabels) => {
  //     return [...new Set(context.appointments!.map((evt) => evt.label))].map(
  //       (label) => {
  //         const currentLabel = prevLabels.find((lbl) => lbl.color === label);
  //         return {
  //           label,
  //           checked: currentLabel ? currentLabel.checked : true,
  //         };
  //       }
  //     );
  //   });
  // }, [context]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showAppointmentModal) {
      setSelectedAppointment(null);
    }
  }, [showAppointmentModal]);

  return (
    <AppointmentContextProvider
      value={{
        schedule,
        setSchedule,
        appointments,
        setAppointments,
        userLabels,
        setUserLabels,
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showAppointmentModal,
        setShowAppointmentModal,
        dispatchCalAppointment,
        selectedAppointment,
        setSelectedAppointment,
        savedAppointments: context,
        showLabelModal,
        setShowLabelModal,
        selectedLabel,
        setSelectedLabel,
        updateLabel,
        filteredAppointments,
      }}
    >
      {children}
      <AppointmentDrawer />
      <AppointmentDetails />
    </AppointmentContextProvider>
  );
}

export default AppointmentContextComponent;
