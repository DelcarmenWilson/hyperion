import { states } from "@/constants/states";
import {
  differenceInYears,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek
} from "date-fns";
 import {
   format as ftz,
   formatInTimeZone
 } from "date-fns-tz";

const defaultDate: string = "MM-dd-yyyy";
const defaultTime: string = "hh:mm aa";
const defaultDateTime: string = `${defaultDate} ${defaultTime}`

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

//FORMAT DATE AND TIME
export const formatDate=(date:Date|string|undefined,retval:string =""):string=>{
  if(!date)
    return retval
  return format(date,retval||defaultDate)
}

export const formatDob=(date:Date|string|undefined|null,retval:string =""):string=>{
  if(!date)
    return retval
  return format(date,"MM/dd/yy")
}

export const formatDateTime=(dateTime:Date|string|undefined|null,retval:string =""):string=>{
  if(!dateTime)
    return retval
  return format(dateTime,defaultDateTime)
}
export const formatDateTimeZone=(date:Date,timeZone:string="US/Eastern",retval:string =""):string=>{
  if(!date)
    return retval
  return formatInTimeZone(date,timeZone,defaultDateTime)
}

export const formatTime=(time:Date|string|null|undefined,retval:string =""):string=>{
  if(!time)
    return retval
  return format(time,defaultTime)
}
export const formatJustTime=(time:string|null|undefined,retval:string =""):string=>{
  if(!time||time=="-")
    return retval
  const date=new Date("1970-01-01T" + time)
  return format(date,defaultTime)
}

export const timeDifference=(timeZone:string|undefined="US/Eastern",agentDate:Date=new Date()):number=>{      
  //LEADS DATE TX (9 to 8)
  const leadDate=new Date(formatDateTimeZone(agentDate, timeZone));
  const timeDiff = dateTimeDiff(agentDate, leadDate);  
return timeDiff
}

export const formatHyperionDate=(date:Date,timeZone:string="US/Eastern",retval:string =""):string=>{
  if(!date)
    return retval
  return formatInTimeZone(date,timeZone,hyperionDate)
}

export const formatTimeZone=(time:Date,timeZone:string="US/Eastern",retval:string =""):string=>{
  if(!time)
    return retval
  return formatInTimeZone(time,timeZone,defaultTime)
}

// TIME
export const calculateTime = (secs: number) => {
  const minutes = Math.floor(secs / 60);
  const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${returnedMinutes}:${returnedSeconds}`;
};


export const dateTimeDiff = function( date1:Date, date2:Date ):number {
  //Get 1 day in milliseconds
  var one_day=1000*60*60;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return Math.round(difference_ms/one_day) *-1; 
}
