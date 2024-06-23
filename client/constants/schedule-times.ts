import { Schedule } from "@prisma/client";

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

export const scheduleTimesHourly: ScheduleTimeType[] = [
  { text: "9 AM", value: "9:00:00 AM", disabled: false },
  { text: "10 AM", value: "10:00:00 AM", disabled: false },
  { text: "11 AM", value: "11:00:00 AM", disabled: false },
  { text: "12 PM", value: "12:00:00 PM", disabled: false },
  { text: "1 PM", value: "1:00:00 PM", disabled: false },
  { text: "2 PM", value: "2:00:00 PM", disabled: false },
  { text: "3 PM", value: "3:00:00 PM", disabled: false },
  { text: "4 PM", value: "4:00:00 PM", disabled: false },
  { text: "5 PM", value: "5:00:00 PM", disabled: false },
  { text: "6 PM", value: "6:00:00 PM", disabled: false },
];

export const generateScheduleTimesOLD = (type: string): ScheduleTimeType[] => {
  const scheduleTimes: ScheduleTimeType[] = [];
  for (let i = 9; i < 18; i++) {
    let num = i;
    let identifier = "AM";
    if (num > 12) {
      num -= 12;
      identifier = "PM";
    }
    const time: ScheduleTimeType = {
      text: `${num} ${identifier}`,
      value: `${num}:00:00 ${identifier}`,
      disabled: false,
    };

    scheduleTimes.push(time);
    if (type == "half") {
      const time: ScheduleTimeType = {
        text: `${num}:30 ${identifier}`,
        value: `${num}:30:00 ${identifier}`,
        disabled: false,
      };
      scheduleTimes.push(time);
    }
  }

  return scheduleTimes;
};

export const generateScheduleTimes = (
  date: Date,
  schedule: BrokenScheduleType,
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
    localDate.setHours(localDate.getHours() + timeDiff*-1);

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

export type BrokenScheduleType = {
  type: string;
  day: string;
  open: number;
  closed: number;
  closedhours: BreaHourType[];
};
type BreaHourType = {
  hour: number;
};

export const breakDownSchedule = (schedule: Schedule) => {
  const newSchedule: BrokenScheduleType[] = [
    breakDownDay("Sunday", schedule.type, schedule.sunday),
    breakDownDay("Monday", schedule.type, schedule.monday),
    breakDownDay("Tuesday", schedule.type, schedule.tuesday),
    breakDownDay("Wednesday", schedule.type, schedule.wednesday),
    breakDownDay("Thursday", schedule.type, schedule.thursday),
    breakDownDay("Friday", schedule.type, schedule.friday),
    breakDownDay("Saturday", schedule.type, schedule.saturday),
  ];

  return newSchedule;
};

const breakDownDay = (
  day: string,
  type: string,
  hours: string
): BrokenScheduleType => {
  if (hours == "Not Available") {
    return { type: type, day: hours, open: 0, closed: 0, closedhours: [] };
  }
  const workBreakSplit = hours.split(",");

  const open = parseInt(workBreakSplit[0].split("-")[0].split(":")[0]);
  const closed = parseInt(workBreakSplit[0].split("-")[1].split(":")[0]);

  const breakFrom = parseInt(workBreakSplit[1].split("-")[0].split(":")[0]);
  const breakTo = parseInt(workBreakSplit[1].split("-")[1].split(":")[0]);

  const closedhours: BreaHourType[] = [];
  for (let i = breakFrom; i <= breakTo; i++) {
    closedhours.push({ hour: i });
  }

  const newHours: BrokenScheduleType = {
    type,
    day,
    open,
    closed,
    closedhours,
  };

  return newHours;
};
