import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Appointment,
  Gender,
  MaritalStatus,
  Schedule,
  User,
} from "@prisma/client";
import { FullAppointment } from "@/types";
import { LeadMainSchemaTypeP } from "@/schemas/lead";

import {
  appointmentInsertBook,
  appointmentGetById,
  appointmentRescheduledByLead,
  appointmentCanceledByLead,
} from "@/actions/appointment";
import { appointmentsGetAllByUserIdUpcoming } from "@/actions/appointment";
import { leadGetByIdMain } from "@/actions/lead";
import { scheduleGetByUserId } from "@/actions/user/schedule";
import { userGetByUserName } from "@/actions/user";

import {
  AppointmentLeadSchema,
  AppointmentLeadSchemaType,
  AppointmentRescheduleSchema,
  AppointmentRescheduleSchemaType,
} from "@/schemas/appointment";

import { useForm } from "react-hook-form";

import {
  breakDownSchedule,
  generateScheduleTimes,
  NewScheduleTimeType,
  ScheduleDay,
} from "@/formulas/schedule";
import { getTommorrow, timeDifference } from "@/formulas/dates";

export const useAppointmentData = () => {
  const { username,appointmentId } = useAppointmentParams();

  const { data: appointment, isFetching: isFetchingAppointment } =
    useQuery<FullAppointment | null>({
      queryFn: () => appointmentGetById(appointmentId),
      queryKey: [`appointment-${appointmentId}`],
    });

  return {username,
    appointmentId,
    appointment,
    isFetchingAppointment,
  };
};

export const useAppointmentActions = () => {
  const { username, leadId, appointmentId } = useAppointmentParams();
  const [userId, setUserId] = useState<string>();

  const { data: user, isFetching: isFetchingUser } = useQuery<User | null>({
    queryFn: () => userGetByUserName(username),
    queryKey: [`appUser-${username}`],
  });

  const { data: appointment, isFetching: isFetchingAppointment } =
    useQuery<Appointment | null>({
      queryFn: () => appointmentGetById(appointmentId),
      queryKey: [`appointment-${appointmentId}`],
    });

  const { data: appointments, isFetching: isFetchingAppointments } = useQuery<Appointment[]>({
    queryFn: () => appointmentsGetAllByUserIdUpcoming(userId),
    queryKey: [`appointments-${userId}`],
  });

  const { data: lead, isFetching: isFetchingLead } =
    useQuery<LeadMainSchemaTypeP | null>({
      queryFn: () => leadGetByIdMain(leadId),
      queryKey: [`appLead-${leadId}`],
    });

  const { data: schedule, isFetching: isFetchingSchedule } =
    useQuery<Schedule | null>({
      queryFn: () => scheduleGetByUserId(userId),
      queryKey: [`appSchedule-${userId}`],
    });

  useEffect(() => {
    if (!user) return;
    setUserId(user.id);
  }, [user]);

  return {
    username,
    appointmentId,
    user,
    isFetchingUser,appointment, isFetchingAppointment,
    appointments,
    isFetchingAppointments,
    lead,
    isFetchingLead,
    schedule,
    isFetchingSchedule,
  };
};
export const useAppointmentFormActions = (
  userId: string,
  lead: LeadMainSchemaTypeP | undefined,
  appointments: Appointment[],
  schedule: Schedule
) => {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  const [brSchedule] = useState<ScheduleDay[]>(breakDownSchedule(schedule));

  //APPOINTMENT VARIABLES
  const [times, setTimes] = useState<NewScheduleTimeType[]>();
  const timeDiff = timeDifference(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const form = useForm<AppointmentLeadSchemaType>({
    resolver: zodResolver(AppointmentLeadSchema),
    //@ts-ignore
    defaultValues: {
      ...lead,
      date: undefined,
      localDate: undefined,
      startDate: undefined,
      agentId: userId,
    } || {
      date: undefined,
      localDate: undefined,
      startDate: undefined,
      agentId: userId,
      leadId: undefined,
      state: "",
      cellPhone: "",
      gender: Gender.Male,
      maritalStatus: MaritalStatus.Single,
      email: "",
    },
  });

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
  };

  const onSetSelectedTime = (tm: NewScheduleTimeType | undefined) => {
    form.setValue("localDate", tm ? tm.localDate : undefined);
    form.setValue("startDate", tm ? tm.agentDate : undefined);
  };

  const onSubmit = async (values: AppointmentLeadSchemaType) => {
    if (!values) return;
    setLoading(true);

    const insertedAppointment = await appointmentInsertBook(values);
    if (insertedAppointment.success) {
      toast.success("Appointment scheduled!");
    } else toast.error(insertedAppointment.error);

    setLoading(false);
  };

  useEffect(() => {
    const date = getTommorrow();
    date.setMinutes(0);
    onDateSelected(date);
  }, []);

  return {
    loading,
    available,
    times,
    onSetSelectedTime,
    form,
    onSubmit,
    onDateSelected,
  };
};

export const useAppointmentRescheduleFormActions = (
  appoinmentId:string,
  appointments: Appointment[],
  schedule: Schedule
) => {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  const [brSchedule] = useState<ScheduleDay[]>(breakDownSchedule(schedule));

  //APPOINTMENT VARIABLES
  const [times, setTimes] = useState<NewScheduleTimeType[]>();
  const timeDiff = timeDifference(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const form = useForm<AppointmentRescheduleSchemaType>({
    resolver: zodResolver(AppointmentRescheduleSchema),
    //@ts-ignore
    defaultValues: { 
      id:appoinmentId,
      date: undefined,
      localDate: undefined,
      startDate: undefined,
    },
  });

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
  };

  const onSetSelectedTime = (tm: NewScheduleTimeType | undefined) => {
    form.setValue("localDate", tm ? tm.localDate : undefined);
    form.setValue("startDate", tm ? tm.agentDate : undefined);
  };

  const onSubmit = async (values: AppointmentRescheduleSchemaType) => {
    if (!values) return;
    setLoading(true);

    const rescheduledAppointment = await appointmentRescheduledByLead(values);
    if (rescheduledAppointment.success) {
      toast.success("Appointment scheduled!");
    } else toast.error(rescheduledAppointment.error);

    setLoading(false);
  };

  useEffect(() => {
    const date = getTommorrow();
    date.setMinutes(0);
    onDateSelected(date);
  }, []);

  return {
    loading,
    available,
    times,
    onSetSelectedTime,
    form,
    onSubmit,
    onDateSelected,
  };
};

export const useAppointmentCancelFormActions = (
) => {
  const {username, appointmentId}=useAppointmentParams()
  const {  appointment, isFetchingAppointment } =
    useAppointmentData();

  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [cancel, setCancel] = useState(false); 

  const onSubmit = async () => {
    setLoading(true);

    const cancelledAppointment = await appointmentCanceledByLead(
      appointmentId,
      reason
    );
    if (cancelledAppointment.success) setCancel(true);

    setLoading(false);
  };

  useEffect(() => {
    if (!appointment) return;
    if (appointment.status != "Scheduled") setCancel(true);
  }, [appointment]);

  return {
    loading,
    appointmentId,
    username,
    reason,setReason,
    cancel,
    appointment, isFetchingAppointment ,
    onSubmit,
  };
};

export const useAppointmentParams = () => {
  const params = useParams();

  const leadId = useMemo(() => {
    if (!params?.leadid) return "";
    return params?.leadid as string;
  }, [params?.leadid]);

  const username = useMemo(() => {
    if (!params?.username) return "";
    return params?.username as string;
  }, [params?.username]);

  const appointmentId = useMemo(() => {
    if (!params?.appointmentid) return "";
    return params?.appointmentid as string;
  }, [params?.appointmentid]);

  return useMemo(
    () => ({ username, leadId, appointmentId }),
    [username, leadId, appointmentId]
  );
};
