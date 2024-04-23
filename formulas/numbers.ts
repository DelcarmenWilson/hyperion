export const getRandomNumber = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatSecondsToTime = (sec_num: number) => {
  var hours: any = Math.floor(sec_num / 3600);
  var minutes: any = Math.floor((sec_num - hours * 3600) / 60);
  var seconds: any = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  // if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds;
};

export const formatSecondsToHours = (sec_num: number) => {
  var hours: number = Math.floor(sec_num / 3600),
    minutes: number = Math.floor((sec_num - hours * 3600) / 60),
    seconds: number = sec_num - hours * 3600 - minutes * 60;
  var hh: string = "",
    mm: string = "",
    ss: string = "";

  if (hours > 0) {
    hh = `${hours} hour${hours > 1 ? "s" : ""} `;
  }

  if (minutes > 0) {
    mm = `${minutes} minute${minutes > 1 ? "s" : ""} `;
  }
  if (seconds > 0) {
    ss = `${seconds} second${seconds > 1 ? "s" : ""} `;
  }
  return `${hh}${mm}${ss}`;
};

export const formatTimeToSeconds = (time: string) => {
  let p = time.split(":"),
    s = 0,
    m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop()!, 10);
    m *= 60;
  }

  return s;
};

export const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

