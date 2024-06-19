import { Schedule } from "@prisma/client";

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

export const generateScheduleTimes = (schedule: BrokenScheduleType,blocked:boolean=false): ScheduleTimeType[] => {
  const scheduleTimes: ScheduleTimeType[] = []; 
  const hour = new Date().getHours()+1
  for (let i = schedule.open; i <= schedule.closed; i++) {
    if(schedule.closedhours.find(e=>e.hour==i))
    continue
    let num = i;
    let identifier = "AM";
    if (num > 12) {
      num -= 12;
      identifier = "PM";
    }
    const time: ScheduleTimeType = {
      text: `${num} ${identifier}`,
      value: `${num}:00:00 ${identifier}`,
      disabled: blocked?i<hour:false,
    };

    scheduleTimes.push(time);
    if (schedule.type == "half") {
      const time: ScheduleTimeType = {
        text: `${num}:30 ${identifier}`,
        value: `${num}:30:00 ${identifier}`,
        disabled: blocked?i<hour:false,
      };
      scheduleTimes.push(time);
    }
  }
//TODO - dont forget to remove this
  console.log(scheduleTimes)

  return scheduleTimes;
};

export type BrokenScheduleType = {
  type:string
  day: string;
  open: number;
  closed: number;
  closedhours: BreaHourType[];
};
type BreaHourType={
  
  hour: number;
}
export const breakDownSchedule = (schedule: Schedule) => {
  const newSchedule: BrokenScheduleType[] = [
    breakDownDay("Sunday", schedule.type, schedule.sunday),
    breakDownDay("Monday", schedule.type, schedule.monday),
    breakDownDay("Tuesday", schedule.type, schedule.tuesday),
    breakDownDay("Wednesday", schedule.type, schedule.wednesday),
    breakDownDay("Thursday", schedule.type, schedule.thursday),
    breakDownDay("Friday", schedule.type, schedule.friday),
    breakDownDay("Saturday", schedule.type, schedule.saturday ),
  ];
  
  return newSchedule;
};

const breakDownDay = (
  day: string,
  type: string,
  hours: string
): BrokenScheduleType => {

  if(hours=="Not Available"){
    return {type:type,
      day: hours,
      open: 0,
      closed: 0,
      closedhours: [],}
  }
  const workBreakSplit = hours.split(",");

  const workFrom = parseInt(workBreakSplit[0].split("-")[0].split(":")[0]);
  const workTo = parseInt(workBreakSplit[0].split("-")[1].split(":")[0]);

  const breakFrom = parseInt(workBreakSplit[1].split("-")[0].split(":")[0]);
  const breakTo = parseInt(workBreakSplit[1].split("-")[1].split(":")[0]);

  const breakHours:BreaHourType[]=[]
  for (let i = breakFrom; i <= breakTo; i++) {
    breakHours.push({hour:i})
  }

  const newHours: BrokenScheduleType = {
    type:type,
    day: day,
    open: workFrom,
    closed: workTo,
    closedhours: breakHours,
  };

  return newHours;
};
