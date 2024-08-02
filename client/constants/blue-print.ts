import { number } from "zod";

export type BluePrintType = {title?:string; calls: number; appointments: number; premium: number };

const yearlyBluePrint: BluePrintType = {
  calls: 14400,
  appointments: 2040,
  premium: 90000,
};

const monthlyBluePrint: BluePrintType = {
  calls: 1200,
  appointments: 170,
  premium: 7500,
};

const weeklyBluePrint: BluePrintType = {
  calls: 300,
  appointments: 42,
  premium: 1875,
};

const dailyBluePrint: BluePrintType = {
  calls: 60,
  appointments: 8,
  premium: 375,
};

export const calculateDailyBluePrint = (target: number): BluePrintType[] => {
    if(target==0)
        return[]
  const days = 52 * 5;
  const premium = target / days;
  const percent = premium / dailyBluePrint.premium;

  const regularDailyBluePrint: BluePrintType = {
    title:"regular",
    calls: Math.ceil(dailyBluePrint.calls * percent),
    appointments: Math.ceil(dailyBluePrint.appointments * percent),
    premium: Math.ceil(dailyBluePrint.premium * percent),
  };


  return multipleBluePrint(regularDailyBluePrint);
};

const multipleBluePrint = (regular: BluePrintType): BluePrintType[] => {
  const { calls, appointments, premium } = regular;
  const percent = 0.2;
  const multipleBluePrints: BluePrintType[] = [
    {   title:"moderate",
      calls: Math.ceil(calls - calls * percent),
      appointments: Math.ceil(appointments - appointments * percent),
      premium: Math.ceil(premium - premium * percent),
    },
    regular,
    {
        title:"aggresive",
      calls: Math.ceil(calls + calls * percent),
      appointments: Math.ceil(appointments + appointments * percent),
      premium: Math.ceil(premium + premium * percent),
    },
  ];

  return multipleBluePrints;
};
