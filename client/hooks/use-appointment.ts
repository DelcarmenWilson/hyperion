import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { useCurrentUser } from "./use-current-user";
import { useAppointmentContext } from "@/providers/app";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { FullAppointment } from "@/types";
import { LeadBasicInfoSchemaTypeP } from "@/schemas/lead";

import {
  AppointmentSchema,
  AppointmentSchemaType,
} from "@/schemas/appointment";

import { timeDifference } from "@/formulas/dates";
import { states } from "@/constants/states";

import {
  breakDownSchedule,
  generateScheduleTimes,
  NewScheduleTimeType,
  ScheduleDay,
} from "@/formulas/schedule";

import { appointmentInsert } from "@/actions/appointment";

type AppointmentStore = {
  //APPOINTMENT FORM
  isFormOpen: boolean;
  onFormOpen: () => void;
  onFormClose: () => void;
  //APPOINTMENT DETAILS
  isDetailsOpen: boolean;
  onDetailsOpen: (e: FullAppointment) => void;
  onDetailsClose: () => void;
  appointment?: FullAppointment;
};

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  //APPOINTMENT FORM
  isFormOpen: false,
  onFormOpen: () => set({ isFormOpen: true }),
  onFormClose: () => set({ isFormOpen: false }),

  //APPOINTMENT DETAILS
  isDetailsOpen: false,
  onDetailsOpen: (e) => set({ isDetailsOpen: true, appointment: e }),
  onDetailsClose: () => set({ isDetailsOpen: false }),
}));

export const useAppointmentActions = (lead: LeadBasicInfoSchemaTypeP) => {
  const user = useCurrentUser();
  const { schedule, appointments, setAppointments } = useAppointmentContext();
  const { onFormClose } = useAppointmentStore();
  const stateData = states.find((e) => e.abv == lead!.state);
  const timeDiff = timeDifference(stateData?.zone);

  const [calOpen, setCalOpen] = useState(false);
  const [available, setAvailable] = useState(false);
  const [brSchedule] = useState<ScheduleDay[]>(breakDownSchedule(schedule!));
  const defaultDate = new Date();
  defaultDate.setMinutes(0);

  //APPOINTMENT VARIABLES
  const [times, setTimes] = useState<NewScheduleTimeType[]>();

  const form = useForm<AppointmentSchemaType>({
    resolver: zodResolver(AppointmentSchema),
    //@ts-ignore
    defaultValues: {
      date: undefined,
      localDate: undefined,
      startDate: undefined,
      agentId: user?.id!,
      leadId: lead?.id!,
      label: "blue",
      comments: "",
      smsReminder: true,
      emailReminder: false,
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();    
    onDateSelected(defaultDate);
    onFormClose();
  };

  const onDateSelected = (date: Date) => {
    if (!date) return;
    form.setValue("date", date);
    onSetSelectedTime(undefined);
    const selectedDay = brSchedule[date.getDay()];
    if (!brSchedule) return;

    const currentapps = appointments?.filter(
      (e) =>
        new Date(e.startDate).toDateString() == date.toDateString() &&
        e.status.toLocaleLowerCase() == "scheduled"
    );
    const currentDate = new Date();
    let blocked = false;
    if (date.getDate() == currentDate.getDate()) {
      blocked = true;
    }
    if (selectedDay.day == "Not Available") {
      setTimes([]);
      setAvailable(false);
    } else {
      const sc = generateScheduleTimes(date, selectedDay, blocked, timeDiff);
      setTimes(sc);
      setAvailable(true);
    }

    setTimes((times) => {
      return times?.map((time) => {
        const oldapp = currentapps?.find(
          (e) =>
            new Date(e.startDate).toLocaleTimeString() ==
            time.agentDate.toLocaleTimeString()
        );
        if (oldapp) time.disabled = true;

        return time;
      });
    });

    setCalOpen(false);
  };

  const onSetSelectedTime = (tm: NewScheduleTimeType | undefined) => {
    form.setValue("localDate", tm ? tm.localDate : undefined);
    form.setValue("startDate", tm ? tm.agentDate : undefined);
  };

   const { mutate: appointmentMutate, isPending: isPendingAppointment } =
    useMutation({
      mutationFn: appointmentInsert,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Appointment scheduled!", {
            id: "insert-appointent",
          });
          onCancel();
        } else {
          toast.success(result.error, {
            id: "insert-appointent",
          });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onAppointmentSubmit = useCallback(
    (values: AppointmentSchemaType) => {
      const toastString = "Creating new Appointment...";
      toast.loading(toastString, { id: "insert-appointent" });
      appointmentMutate(values);
    },
    [appointmentMutate]
  );

  useEffect(() => {
    onDateSelected(defaultDate);
  }, []);

  return {
    form,
    onCancel,
    onDateSelected,
    onSetSelectedTime,
    times,
    stateData,
    calOpen,
    setCalOpen,
    onFormClose,
    available,
    onAppointmentSubmit,
    isPendingAppointment,
  };
};