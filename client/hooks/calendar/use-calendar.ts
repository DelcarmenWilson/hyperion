import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCalendarStore } from "../../stores/calendar-store";

import { AppointmentLabelSchemaType } from "@/schemas/appointment";
import {
  createAppointmentLabel,
  updateAppointmentLabel,
} from "@/actions/appointment";

export const useCalendarData = () => {
  const { appointments, labels } = useCalendarStore();

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

  return {
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
    mutationFn: createAppointmentLabel,
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
    mutationFn: updateAppointmentLabel,
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
