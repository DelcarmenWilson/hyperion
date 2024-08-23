import { Schedule } from "@prisma/client";
//BREAKDOWN SCHEDULE
export const daysOfTheWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
export type ScheduleDay = {
  index: number;
  available: boolean;
  day: string;
  type: string;
  workFrom: string | undefined;
  workTo: string | undefined;
  breakFrom1: string | undefined;
  breakTo1: string | undefined;
  breakFrom2: string | undefined;
  breakTo2: string | undefined;
  open: number;
  closed: number;
  closedhours: BreakHourType[];
};
export const defaultDay: ScheduleDay = {
  available: true,
  breakFrom1: "12:00",
  breakFrom2: "14:00",
  breakTo1: "13:00",
  breakTo2: "15:00",
  closed: 18,
  closedhours: [{ hour: 12 }, { hour: 14 }],
  day: "monday",
  index: 1,
  open: 9,
  type: "hourly",
  workFrom: "09:00",
  workTo: "18:00",
};

export const getNewDefaultDay=(index:number)=>{
  let clone = JSON.parse(JSON.stringify(defaultDay));
  clone.index=index;
  clone.day=daysOfTheWeek[index]

return clone;
}
type BreakHourType = {
  hour: number;
};
export const breakDownSchedule = (schedule: Schedule): ScheduleDay[] => {
  const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
    schedule;
  const sch: ScheduleDay[] = [
    sunday,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
  ].map((day, index) => {
    return breakDownDay(index, day, schedule.type);
  });
  return sch;
};

const breakDownDay = (
  index: number,
  schedule: string,
  type: string
): ScheduleDay => {
  const hours = schedule == "Not Available" ? null : schedule.split(",");
  const availabelHours = hours ? hours[0] : undefined;
  const breakHours = hours
    ? hours[1]
      ? hours[1].split("|")
      : undefined
    : undefined;
  const break1Hours = breakHours ? breakHours[0] : undefined;
  const break2Hours = breakHours ? breakHours[1] : undefined;

  //VAILABLE HOURS
  const workFrom = availabelHours?.split("-")[0];
  const workTo = availabelHours?.split("-")[1];
  //BREAKS
  const breakFrom1 = break1Hours?.split("-")[0];
  const breakTo1 = break1Hours?.split("-")[1];
  const breakFrom2 = break2Hours?.split("-")[0];
  const breakTo2 = break2Hours?.split("-")[1];

  const open = workFrom ? parseInt(workFrom.split(":")[0]) : 0;
  const closed = workTo ? parseInt(workTo.split(":")[0]) : 0;
  //BREAK HOURS
  const breakFrom1Hours = breakFrom1 ? parseInt(breakFrom1.split(":")[0]) : 0;
  const breakTo1Hours = breakTo1 ? parseInt(breakTo1.split(":")[0]) : 0;
  const breakFrom2Hours = breakFrom2 ? parseInt(breakFrom2.split(":")[0]) : 0;
  const breakTo2Hours = breakTo2 ? parseInt(breakTo2.split(":")[0]) : 0;

  const closedhours: BreakHourType[] = [];
  if (breakTo1Hours > breakFrom1Hours)
    for (let i = breakFrom1Hours; i < breakTo1Hours; i++) {
      closedhours.push({ hour: i });
    }
  if (breakTo2Hours > breakFrom2Hours)
    for (let i = breakFrom2Hours; i < breakTo2Hours; i++) {
      closedhours.push({ hour: i });
    }
  const newDay: ScheduleDay = {
    available: schedule != "Not Available",
    index,
    day: daysOfTheWeek[index],
    type,
    workFrom,
    workTo,
    breakFrom1,
    breakTo1,
    breakFrom2,
    breakTo2,
    open,
    closed,
    closedhours,
  };

  return newDay;
};

//CONSOLIDATE SCHEDULE

type ConsolidatedSchedule = {
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
};
export const consolitateSchedule = (
  schedule: ScheduleDay[]
): ConsolidatedSchedule => {
  const sch: ConsolidatedSchedule = {
    sunday: consolitateDay(schedule[0]),
    monday: consolitateDay(schedule[1]),
    tuesday: consolitateDay(schedule[2]),
    wednesday: consolitateDay(schedule[3]),
    thursday: consolitateDay(schedule[4]),
    friday: consolitateDay(schedule[5]),
    saturday: consolitateDay(schedule[6]),
  };
  return sch;
};

export const consolitateDay = (schedule: ScheduleDay): string => {
  const {
    workFrom,
    workTo,
    breakFrom1,
    breakTo1,
    breakFrom2,
    breakTo2,
    available,
  } = schedule;
  if (!available) return "Not Available";
  const work = `${workFrom}-${workTo}`;
  const break1 = `${breakFrom1}-${breakTo1}`;
  const break2 = `${breakFrom2}-${breakTo2}`;
  let day = `${work},`;

  if (breakFrom1) {
    day = `${day}${break1}`;
  }
  if (breakFrom2) {
    day = `${day}|${break2}`;
  }

  return day;
};

//SCHEDULE TIMES
export type NewScheduleTimeType = {
  text: string;
  localDate: Date;
  agentDate: Date;
  disabled: boolean;
};

export type ScheduleTimeType = {
  text: string;
  value: string;
  disabled: boolean;
};

export const scheduleTimes: ScheduleTimeType[] = [
  { text: "9 AM", value: "9:00:00 AM", disabled: false },
  { text: "9:30 AM", value: "9:30:00 AM", disabled: false },
  { text: "10 AM", value: "10:00:00 AM", disabled: false },
  { text: "10:30 AM", value: "10:30:00 AM", disabled: false },
  { text: "11 AM", value: "11:00:00 AM", disabled: false },
  { text: "11:30 AM", value: "11:30:00 AM", disabled: false },
  { text: "12 PM", value: "12:00:00 PM", disabled: false },
  { text: "12:30 PM", value: "12:30:00 PM", disabled: false },
  { text: "1 PM", value: "1:00:00 PM", disabled: false },
  { text: "1:30 PM", value: "1:30:00 PM", disabled: false },
  { text: "2 PM", value: "2:00:00 PM", disabled: false },
  { text: "2:30 PM", value: "2:30:00 PM", disabled: false },
  { text: "3 PM", value: "3:00:00 PM", disabled: false },
  { text: "3:30 PM", value: "3:30:00 PM", disabled: false },
  { text: "4 PM", value: "4:00:00 PM", disabled: false },
  { text: "4:30 PM", value: "4:30:00 PM", disabled: false },
  { text: "5 PM", value: "5:00:00 PM", disabled: false },
  { text: "5:30 PM", value: "5:30:00 PM", disabled: false },
  { text: "6 PM", value: "6:00:00 PM", disabled: false },
  { text: "6:30 PM", value: "6:30:00 PM", disabled: false },
];

export const generateScheduleTimes = (
  date: Date,
  schedule: ScheduleDay,
  blocked: boolean = false,
  timeDiff: number = 0
): NewScheduleTimeType[] => {
  const scheduleTimes: NewScheduleTimeType[] = [];
  const hour = new Date().getHours() + 1;

  for (let i = schedule.open; i <= schedule.closed; i++) {
    if (schedule.closedhours.find((e) => e.hour == i)) continue;
    let identifier = "AM";

    const agentDate = new Date(date.setHours(i));

    const localDate = new Date(agentDate);
    localDate.setHours(localDate.getHours() + timeDiff * -1);

    const textDate = new Date(localDate);
    textDate.setHours(textDate.getHours());

    let displayText = textDate.getHours();

    if (displayText >= 12) {
      identifier = "PM";
    }
    if (displayText > 12) {
      displayText -= 12;
    }
    if (displayText == 0) {
      displayText = 12;
    }

    const time: NewScheduleTimeType = {
      text: `${displayText} ${identifier}`,
      localDate: localDate,
      agentDate: agentDate,
      disabled: blocked ? i < hour : false,
    };

    scheduleTimes.push(time);
    if (schedule.type == "half") {
      const lDate = new Date(localDate);
      lDate.setMinutes(lDate.getMinutes() + 30);
      const mDate = new Date(agentDate);
      mDate.setMinutes(mDate.getMinutes() + 30);

      const time: NewScheduleTimeType = {
        text: `${displayText}:30 ${identifier}`,
        localDate: lDate,
        agentDate: mDate,
        disabled: blocked ? i < hour : false,
      };
      scheduleTimes.push(time);
    }
  }
  return scheduleTimes;
};
