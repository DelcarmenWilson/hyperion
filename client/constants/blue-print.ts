
export type BluePrintType = {type?:string; calls: number; appointments: number; premium: number };

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

// export const calculateDailyBluePrint = (target: number): BluePrintType[] => {
//     if(target==0)
//         return[]
//   const days = 52 * 5;
//   const premium = target / days;
//   const percent = premium / dailyBluePrint.premium;

//   const regularDailyBluePrint: BluePrintType = {
//     type:"regular",
//     calls: Math.ceil(dailyBluePrint.calls * percent),
//     appointments: Math.ceil(dailyBluePrint.appointments * percent),
//     premium: Math.ceil(dailyBluePrint.premium * percent),
//   };


//   return multipleBluePrint(regularDailyBluePrint);
// };


export const calculateWeeklyBluePrint = (target: number): BluePrintType[] => {
  if(target==0)
      return[]
const week = 52;
const targetPremium = target / week;
const {calls,appointments,premium}=weeklyBluePrint;
const percent = targetPremium / premium;

const regularWeeklyBluePrint: BluePrintType = {
  type:"regular",
  calls: Math.ceil(calls * percent),
  appointments: Math.ceil(appointments * percent),
  premium: Math.ceil(premium * percent),
};


return multipleBluePrint(regularWeeklyBluePrint);
};

const multipleBluePrint = (regular: BluePrintType): BluePrintType[] => {
  const { calls, appointments, premium } = regular;
  const percent = 0.2;
  const multipleBluePrints: BluePrintType[] = [
    {   type:"moderate",
      calls: Math.ceil(calls - calls * percent),
      appointments: Math.ceil(appointments - appointments * percent),
      premium: Math.ceil(premium - premium * percent),
    },
    regular,
    {
        type:"aggresive",
      calls: Math.ceil(calls + calls * percent),
      appointments: Math.ceil(appointments + appointments * percent),
      premium: Math.ceil(premium + premium * percent),
    },
  ];

  return multipleBluePrints;
};
