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

