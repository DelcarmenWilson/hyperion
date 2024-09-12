import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { userEmitter } from "@/lib/event-emmiter";
import { useAppointmentContext } from "@/providers/app";
import { useLeadData } from "./lead/use-lead";
import { useCurrentUser } from "./use-current-user";
import { toast } from "sonner";

import { FullAppointment } from "@/types";

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

export const useAppointmentData = () => {
  const user = useCurrentUser();
  const { isFormOpen, onFormClose } = useAppointmentStore();
  const { schedule, appointments, setAppointments } = useAppointmentContext();
  const { leadBasic, isFetchingLeadBasic } = useLeadData();
  const stateData = states.find((e) => e.abv == leadBasic?.state);
  const timeDiff = timeDifference(stateData?.zone);

  const [loading, setLoading] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [available, setAvailable] = useState(false);
  const [brSchedule] = useState<ScheduleDay[]>(breakDownSchedule(schedule!));

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
      leadId: leadBasic?.id!,
      label: "blue",
      comments: "",
      smsReminder: true,
      emailReminder: false,
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onFormClose();
  };

  const onDateSelected = (date: Date) => {
    console.log(date);
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

  const onSubmit = async (values: AppointmentSchemaType) => {
    if (!values) return;
    setLoading(true);

    const insertedAppointment = await appointmentInsert(values);
    if (insertedAppointment.success) {
      userEmitter.emit(
        "appointmentScheduled",
        insertedAppointment.success.appointment
      );
      userEmitter.emit("messageInserted", insertedAppointment.success.message!);
      toast.success("Appointment scheduled!");
      onFormClose();
    } else toast.error(insertedAppointment.error);

    setLoading(false);
  };

  useEffect(() => {
    const date = new Date();
    date.setMinutes(0);
    onDateSelected(date);
  }, []);

  return {
    leadBasic,
    isFetchingLeadBasic,
    loading,
    form,
    onCancel,
    onDateSelected,
    onSetSelectedTime,
    times,
    stateData,
    calOpen,
    setCalOpen,
    isFormOpen,
    onFormClose,
    available,
    onSubmit,
  };
};

// export const useAppointmentData = () => {
//   const user = useCurrentUser();
//   const { onFormClose } = useAppointmentStore();
//   const { schedule, appointments, setAppointments } = useAppointmentContext();
//   const { leadBasic } = useLeadData();
//   const stateData = states.find((e) => e.abv == leadBasic?.state);
//   const timeDiff = timeDifference(stateData?.zone);

//   const [loading, setLoading] = useState(false);
//   const [calOpen, setCalOpen] = useState(false);
//   const [available, setAvailable] = useState(true);
//   const [brSchedule] = useState<ScheduleDay[]>(breakDownSchedule(schedule!));

//   //APPOINTMENT VARIABLES
//   const [times, setTimes] = useState<NewScheduleTimeType[]>();
//   const [selectedDate, setSelectedDate] = useState<Date>(getTommorrow);
//   const [selectedTime, setSelectedTime] = useState<
//     NewScheduleTimeType | undefined
//   >();
//   const [comments, setComments] = useState("");
//   const [reminder, setReminder] = useState(true);

//   const form = useForm<AppointmentSchemaType>({
//     resolver: zodResolver(AppointmentSchema),
//     //@ts-ignore
//     defaultValues: {
//       localDate: new Date(),
//       startDate: getTommorrow(),
//       agentId: user?.id!,
//       leadId: leadBasic?.id!,
//       label: "blue",
//       comments: "",
//       reminder: true,
//     },
//   });

//   const onCancel = () => {
//     form.clearErrors();
//     form.reset();
//     onFormClose();
//   };

//   const onDateSelected = (date: Date) => {
//     if (!date) return;
//     setSelectedDate(date);
//     setSelectedTime(undefined);
//     const selectedDay = brSchedule[date.getDay()];
//     if (!brSchedule) return;

//     const currentapps = appointments?.filter(
//       (e) =>
//         new Date(e.startDate).toDateString() == date.toDateString() &&
//         e.status.toLocaleLowerCase() == "scheduled"
//     );
//     const currentDate = new Date();
//     let blocked = false;
//     if (date.getDate() == currentDate.getDate()) {
//       blocked = true;
//     }
//     if (selectedDay.day == "Not Available") {
//       setTimes([]);
//       setAvailable(false);
//     } else {
//       const sc = generateScheduleTimes(date, selectedDay, blocked, timeDiff);
//       setTimes(sc);
//       setAvailable(true);
//     }

//     setTimes((times) => {
//       return times?.map((time) => {
//         const oldapp = currentapps?.find(
//           (e) =>
//             new Date(e.startDate).toLocaleTimeString() ==
//             time.agentDate.toLocaleTimeString()
//         );
//         if (oldapp) time.disabled = true;

//         return time;
//       });
//     });

//     setCalOpen(false);
//   };

//   const onSubmit = async (e: any) => {
//     e.preventDefault();
//     if (!selectedTime) return;
//     setLoading(true);

//     const appointment: AppointmentSchemaType = {
//       localDate: selectedTime.localDate,
//       startDate: selectedTime.agentDate,
//       agentId: user?.id!,
//       leadId: leadBasic?.id!,
//       label: "blue",
//       comments: comments,
//       reminder: reminder,
//     };

//     const insertedAppointment = await appointmentInsert(appointment);
//     if (insertedAppointment.success) {
//       // const newApps=[...appointments!,insertedAppointment.success.appointment]
//       // setAppointments((apps) => {
//       //   if (!apps) return apps;
//       //   return [...apps!, insertedAppointment.success.appointment];
//       // });
//       userEmitter.emit(
//         "appointmentScheduled",
//         insertedAppointment.success.appointment
//       );
//       userEmitter.emit("messageInserted", insertedAppointment.success.message!);
//       toast.success("Appointment scheduled!");
//       onFormClose();
//     } else toast.error(insertedAppointment.error);

//     setLoading(false);
//   };

//   useEffect(() => {
//     const initialLoad = () => {
//       onDateSelected(new Date());
//     };
//     return () => initialLoad();
//   }, []);

//   return {
//     leadBasic,
//     loading,
//     form,
//     onCancel,
//     selectedDate,
//     onDateSelected,
//     selectedTime,
//     setSelectedTime,
//     times,
//     stateData,
//     calOpen,
//     setCalOpen,
//     onFormClose,
//     reminder,
//     setReminder,
//     available,
//     comments,
//     setComments,
//     onSubmit,
//   };
// };
