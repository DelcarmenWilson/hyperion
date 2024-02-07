import { states } from "@/constants/states";
import { format } from "date-fns";
import moment from "moment";

export const getAge = (dateOfBirth: any) => {
  return moment().diff(dateOfBirth, "years");
};

export const concateDate = (date: Date, time: string): Date => {
  const prefix = time.substring(time.length - 2);
  const colonIdx = time.indexOf(":");
  let hours = parseInt(time.substring(0, colonIdx));

  const minutes = parseInt(time.substring(colonIdx + 1).substring(0, 2));

  if (prefix == "PM") {
    hours += 12;
  }

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);

  return date;
};

export const getLocalTime=(abv:string)=>{


  let date=new Date()
  const utcHours=date.getUTCHours()
  const offset=states.find(e=>e.abv==abv)


  // date.getUTCDate()
  //   date.setHours(offset?.offset||0)
  
 return utcHours
  return format(date.getUTCDate(),"hh:mm aa")
}

export const getTommorrow=():Date=>{
  let tommorrow = new Date();
  tommorrow.setHours(0,0)
  tommorrow.setDate(tommorrow.getDate() + 1);
  return tommorrow
}

export const getToday=():Date=>{
  let today = new Date();
  today.setHours(0,0)
  return today
}

export const getYesterday=():Date=>{
  let yesterday = new Date();
  yesterday.setHours(0,0)
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday
}

export const getLast24hrs=():Date=>{
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday
}