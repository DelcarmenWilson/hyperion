import { scheduleUpdateByUserId } from "@/actions/user/schedule";
import {
  breakDownSchedule,
  consolitateSchedule,
  daysOfTheWeek,
  defaultDay,
  getNewDefaultDay,
  ScheduleDay,
} from "@/formulas/schedule";
import { ScheduleSchemaType } from "@/schemas/settings";
import { Schedule } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { create } from "zustand";

type useScheduleStore = {
  //SCHEDULE BREAK FORM
  isOpen: boolean;
  schedule?: ScheduleDay;
  onOpen: (schedule: ScheduleDay) => void;
  onClose: () => void;
};

export const useSchedule = create<useScheduleStore>((set) => ({
  //SCHEDULE BREAK FORM
  isOpen: false,
  onOpen: (s) => set({ schedule: s, isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useScheduleActions = (schedule: Schedule) => {
  const [loading, setLoading] = useState(false);
  const [brSchedule, setBrSchedule] = useState(breakDownSchedule(schedule));

  const onSetDay = (e: ScheduleDay) => {
    const newSc = Array.from(brSchedule);
    newSc[e.index] = e;
    setBrSchedule(newSc);
  };

  const onSetAvailable = (i: number, available: boolean) => {
    const newSc = Array.from(brSchedule);
    newSc[i].available = available;
    if (available) {
      // newSc[i] = defaultDay;
      //   newSc[i].index = i;
      //   newSc[i].day = daysOfTheWeek[i];
      newSc[i] = getNewDefaultDay(i);
    }

    console.log(newSc);
    setBrSchedule(newSc);
  };
  const onSetWorkHours = (i: number, type: "from" | "to", time: string) => {
    // const hours = parseInt(time.split(":")[0]);
    const newSc = Array.from(brSchedule);
    if (type == "from") newSc[i].workFrom = time;
    else newSc[i].workTo = time;

    setBrSchedule(newSc);
  };

  const onSubmit = async (values: ScheduleSchemaType) => {
    setLoading(true);
    const cs = consolitateSchedule(brSchedule);
    values = { ...values, ...cs };

    const updatedSchedule = await scheduleUpdateByUserId(values);
    if (updatedSchedule.success) toast.success(updatedSchedule.success);
    else toast.error(updatedSchedule.error);

    setLoading(false);
  };

  return {
    loading,
    brSchedule,
    onSetDay,
    onSetAvailable,
    onSetWorkHours,
    onSubmit,
  };
};

export const useScheduleBreak = (
  schedule: ScheduleDay | undefined,
  setDay: (e: ScheduleDay) => void,
  onClose: () => void
) => {
  const [scd, setScd] = useState(schedule);

  const showBreak1 = scd?.breakFrom1 !== undefined;
  const showBreak2 = scd?.breakFrom2 !== undefined;

  const setShowBreak = (type: number) => {
    setScd((sc) => {
      if (!sc) return sc;
      if (type == 1) {
        if (schedule?.breakFrom1) {
          return {
            ...sc,
            breakFrom1: schedule?.breakFrom1,
            breakTo1: schedule?.breakTo1,
          };
        }
        return { ...sc, breakFrom2: "12:00", breakTo2: "13:00" };
      }
      if (schedule?.breakFrom2) {
        return {
          ...sc,
          breakFrom2: schedule?.breakFrom2,
          breakTo2: schedule?.breakTo2,
        };
      }
      return { ...sc, breakFrom2: "13:00", breakTo2: "14:00" };
    });
  };

  const onSetSchedule = (bk: string, val: string) => {
    setScd((sc) => {
      if (!sc) return sc;
      return { ...sc, [bk]: val };
    });
  };

  const onResetSchedule = (type: number) => {
    setScd((sc) => {
      if (!sc) return sc;
      if (type == 1)
        return {
          ...sc,
          breakFrom1: undefined,
          breakTo1: undefined,
          breakFrom2: undefined,
          breakTo2: undefined,
        };

      return { ...sc, breakFrom2: undefined, breakTo2: undefined };
    });
  };

  const onSubmit = () => {
    if (!scd) return;
    setDay(scd);
    onClose();
  };

  useEffect(() => {
    if (!schedule) return;
    setScd(schedule);
  }, [schedule]);

  return {
    scd,
    showBreak1,
    showBreak2,
    setShowBreak,
    onSetSchedule,
    onResetSchedule,
    onSubmit,
  };
};
