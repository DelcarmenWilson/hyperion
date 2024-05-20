import { states } from "@/constants/states";
import {
  differenceInYears,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export const hyperionDate: string = "MMMM do yyyy";
export const getAge = (dateOfBirth: any): string => {
  if (!dateOfBirth) return "NA";
  return differenceInYears(new Date(), dateOfBirth).toString();
};

export const concateDate = (
  date: Date,
  time: string,
  isAssistant: boolean = false
): Date => {
  const prefix = time.substring(time.length - 2);
  const colonIdx = time.indexOf(":");
  let hours = parseInt(time.substring(0, colonIdx));

  const minutes = parseInt(time.substring(colonIdx + 1).substring(0, 2));

  if (prefix == "PM") {
    hours += 12;
  }
  if (isAssistant) {
    hours = hours > 12 ? hours - 12 : hours + 12;
  }

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);

  return date;
};

export const weekStartEnd = (): { from: Date; to: Date } => {
  const curr = new Date();
  const start = startOfWeek(curr);
  const end = endOfWeek(curr);

  return { from: start, to: end };
};
export const monthStartEnd = (): { from: Date; to: Date } => {
  const curr = new Date();
  const start = startOfMonth(curr);
  const end = endOfMonth(curr);
  return { from: start, to: end };
};

export const getLocalTime = (abv: string) => {
  let date = new Date();
  const utcHours = date.getUTCHours();
  const offset = states.find((e) => e.abv == abv);

  // date.getUTCDate()
  //   date.setHours(offset?.offset||0)

  return utcHours;
  return format(date.getUTCDate(), "hh:mm aa");
};

export const getTommorrow = (): Date => {
  let tommorrow = new Date();
  tommorrow.setHours(0, 0);
  tommorrow.setDate(tommorrow.getDate() + 1);
  return tommorrow;
};


export const  getToday = (): Date => {
  let today = new Date();
  today.setHours(0, 0);
  return today;
};

export const getEntireDay = (): { start: Date; end: Date } => {
  let start = new Date();
  start.setHours(0, 0, 0);
  let end = new Date();
  end.setHours(23, 59);
  return { start, end };
};

export const getYesterday = (): Date => {
  let yesterday = new Date();
  yesterday.setHours(0, 0);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
};

export const getLast24hrs = (): Date => {
  let yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);
  return yesterday;
};
