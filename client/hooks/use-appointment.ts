import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentUser } from "./user/use-current";
import { useMutation } from "@tanstack/react-query";
import { useCalendarStore } from "../stores/calendar-store";
import { useInvalidate } from "./use-invalidate";
import { useAppointmentStore } from "@/stores/appointment-store";
import { toast } from "sonner";

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

export const useAppointmentActions = (lead: LeadBasicInfoSchemaTypeP) => {
  const user = useCurrentUser();
  const { appointments, schedule, labels } = useCalendarStore();
  const { invalidate } = useInvalidate();
  const { onApointmentFormClose } = useAppointmentStore();
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
    onApointmentFormClose();
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
    onApointmentFormClose,
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
