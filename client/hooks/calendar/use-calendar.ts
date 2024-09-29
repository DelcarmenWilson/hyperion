import { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCalendarStore } from "./use-calendar-store";
import { Appointment, AppointmentLabel, Schedule } from "@prisma/client";

import { AppointmentLabelSchemaType } from "@/schemas/appointment";
import {
  appointmentLabelInsert,
  appointmentLabelsGetAll,
  appointmentLabelUpdateById,
  appointmentsGet,
} from "@/actions/appointment";
import { scheduleGet } from "@/actions/user/schedule";
import { CalendarAppointment } from "@/types/appointment";

export const useCalendarData = () => {
  const { loaded, initialSetUp, appointments, labels } = useCalendarStore();

  const { data: loadedSchedule, isFetching: isFetchingSchedule } = useQuery<
    Schedule | null | undefined
  >({
    queryFn: () => scheduleGet(),
    queryKey: ["user-schedule"],
  });

  const { data: loadedAppointments, isFetching: isFetchingAppointments } =
    useQuery<CalendarAppointment[]>({
      queryFn: () => appointmentsGet(),
      queryKey: ["user-appointments"],
    });

  const { data: loadedLabels, isFetching: isFetchingAppointmentLabels } =
    useQuery<AppointmentLabel[]>({
      queryFn: () => appointmentLabelsGetAll(),
      queryKey: ["user-appointments-labels"],
    });

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    if (!labels) return appointments;
    return appointments.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.id)
        .includes(evt.labelId as string)
    );
  }, [appointments, labels]);

  useEffect(() => {
    if (loaded) return;
    if (!loadedAppointments || !loadedSchedule || !loadedLabels) return;
    initialSetUp(loadedAppointments, loadedLabels, loadedSchedule);
  }, [loaded, loadedAppointments, loadedLabels, loadedSchedule]);

  return {
    appointments: loadedAppointments,
    isFetchingAppointments,
    appointmentLabels: loadedLabels,
    isFetchingAppointmentLabels,
    schedule: loadedSchedule,
    isFetchingSchedule,
    filteredAppointments,
  };
};

export const useCalendarActions = () => {
  const { setShowLabelModal, selectedLabel, addLabel, updateLabel } =
    useCalendarStore();
  //LABLES

  const {
    mutate: appointmentLabelInsertMutate,
    isPending: appointmentLabelInsertIsPending,
  } = useMutation({
    mutationFn: appointmentLabelInsert,
    onSuccess: (results) => {
      if (results.success) {
        addLabel(results.success);
        setShowLabelModal(false);
        toast.success("Label Created", { id: "insert-appointment-label" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: appointmentLabelUpdateMutate,
    isPending: appointmentLabelUpdateIsPending,
  } = useMutation({
    mutationFn: appointmentLabelUpdateById,
    onSuccess: (results) => {
      if (results.success) {
        updateLabel(results.success);
        setShowLabelModal(false);
        toast.success("Label Updated", { id: "update-appointment-label" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onAppointmentLabelUpsert = useCallback(
    (values: AppointmentLabelSchemaType) => {
      if (selectedLabel) {
        toast.loading("Updating Appointment Label...", {
          id: "update-appointment-label",
        });
        appointmentLabelUpdateMutate(values);
      } else {
        toast.loading("Creating New Appointment Label...", {
          id: "insert-appointment-label",
        });
        appointmentLabelInsertMutate(values);
      }
    },
    [appointmentLabelInsertMutate, appointmentLabelUpdateMutate]
  );

  return {
    onAppointmentLabelUpsert,
    appointmentLabelInsertIsPending,
    appointmentLabelUpdateIsPending,
  };
};
