import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { useCurrentUser } from "./user/use-current";
import { useMutation } from "@tanstack/react-query";
import { useCalendarStore } from "./calendar/use-calendar-store";
import { useInvalidate } from "./use-invalidate";
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

import {
  cancelAppointmentAgent,
  createAppointment,
} from "@/actions/appointment";
import { AppointmentStatus } from "@/types/appointment";

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

export const useAppointmentActions = (lead: LeadBasicInfoSchemaTypeP) => {
  const user = useCurrentUser();
  const { appointments, schedule, labels } = useCalendarStore();
  const { invalidate } = useInvalidate();
  const { onApointmentFormClose: onFormClose } = useAppointmentStore();
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
      labelId: labels![0].id!,
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
      mutationFn: createAppointment,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Appointment scheduled!", { id: "insert-appointent" });
          invalidate("blueprint-active");
          invalidate("blueprint-week-active");
          onCancel();
        } else {
          toast.success(result.error, { id: "insert-appointent" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onAppointmentSubmit = useCallback(
    (values: AppointmentSchemaType) => {
      toast.loading("Creating new Appointment...", { id: "insert-appointent" });
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

export const useAppointmentCancel = () => {
  const { invalidate } = useInvalidate();
  const { mutate: cancelAppointmentMutate, isPending: AppointmentCancelling } =
    useMutation({
      mutationFn: cancelAppointmentAgent,
      onSuccess: () => {
        toast.success("Appointment Cancel!", { id: "cancel-appointent" });
        invalidate("agentAppointments");
      },
      onError: (error) => {
        toast.error(error.message, { id: "cancel-appointent" });
      },
    });

  const onCancelAppointment = useCallback(
    (values: { id: string; reason: string }) => {
      toast.loading("Cancelling Appointment...", {
        id: "cancel-appointent",
      });
      cancelAppointmentMutate(values);
    },
    [cancelAppointmentMutate]
  );

  return {
    onCancelAppointment,
    AppointmentCancelling,
  };
};
