import { FullCall, Sales } from "@/types";
import { BluePrintWeek } from "@prisma/client";

type GraphData = {
  name: string;
  total: number;
};
const graphData: GraphData[] = [
  { name: "Jan", total: 0 },
  { name: "Feb", total: 0 },
  { name: "Mar", total: 0 },
  { name: "Apr", total: 0 },
  { name: "May", total: 0 },
  { name: "Jun", total: 0 },
  { name: "Jul", total: 0 },
  { name: "Aug", total: 0 },
  { name: "Sep", total: 0 },
  { name: "Oct", total: 0 },
  { name: "Nov", total: 0 },
  { name: "Dec", total: 0 },
];

//SALES INFORMATION

export const convertSalesData = (sales: Sales[]) => {
  const monthlyRevenue: { [key: number]: number } = {};

  for (const sale of sales) {
    const month = sale.updatedAt.getMonth();
    monthlyRevenue[month] =
      (monthlyRevenue[month] || 0) + parseFloat(sale.policy?.ap!);
  }
  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }
  return graphData;
};

export const convertBluePrintMonthData = (
  weeks: BluePrintWeek[],
  isWeekly: boolean,
  currentMonth: string
) => {
  if (!weeks) {
    return graphData;
  }
  if (isWeekly) {
    const monthData = weeks.filter(
      (w) => w.createdAt.getMonth().toString() == currentMonth
    );
    return convertBluePrintWeekData(monthData);
  }

  const monthlyPremium: { [key: number]: number } = {};

  for (const week of weeks) {
    const month = week.createdAt.getMonth();

    monthlyPremium[month] = (monthlyPremium[month] || 0) + week.premium;
  }
  for (const month in monthlyPremium) {
    graphData[parseInt(month)].total = monthlyPremium[parseInt(month)];
  }
  return graphData;
};

const convertBluePrintWeekData = (weeks: BluePrintWeek[]) => {
  let graphData: GraphData[] = [];
  weeks.forEach((week,i) => {
    graphData.push({
      name: `Week ${i+1}`,
      total: week.premium,
    });
  });

  return graphData;
};

type CallReportData = {
  day: string;
  duration: number;
  total: number;
};

export const convertCallData = (calls: FullCall[]) => {
  const dailyCalls: CallReportData[] = [];

  for (const call of calls) {
    const day = call.createdAt.toDateString();
    const report = dailyCalls.find((e) => e.day == day);
    if (report) {
      report.duration += call.duration ? call.duration : 0;
      report.total += 1;
    } else {
      const newReport: CallReportData = {
        day: day,
        duration: call.duration ? call.duration : 0,
        total: 1,
      };
      dailyCalls.push(newReport);
    }
  }
  return dailyCalls.reverse();
};
