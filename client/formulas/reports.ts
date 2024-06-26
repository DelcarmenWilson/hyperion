import { FullCall, Sales } from "@/types";

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

export const convertSalesData = (sales: Sales[]) => {
  const monthlyRevenue: { [key: number]: number } = {};

  for (const sale of sales) {
    const month = sale.updatedAt.getMonth();
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + parseFloat(sale.policy?.ap!);
  }
  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }
  return graphData;
};

// interface GraphData {
//   name: string;
//   total: number;
// }
// export const getGraphRevenue = () => {
//   const monthlyRevenue: { [key: number]: number } = {
//     0: 4500,
//     1: 5000,
//     2: 4300,
//     3: 1200,
//     4: 5700,
//     5: 4200,
//     6: 4600,
//     7: 4200,
//     8: 4900,
//     9: 3000,
//     10: 2800,
//     11: 2700,
//   };

//   const graphData: GraphData[] = [
//     { name: "Jan", total: 0 },
//     { name: "Feb", total: 0 },
//     { name: "Mar", total: 0 },
//     { name: "Apr", total: 0 },
//     { name: "May", total: 0 },
//     { name: "Jun", total: 0 },
//     { name: "Jul", total: 0 },
//     { name: "Aug", total: 0 },
//     { name: "Sep", total: 0 },
//     { name: "Oct", total: 0 },
//     { name: "Nov", total: 0 },
//     { name: "Dec", total: 0 },
//   ];
//   for (const month in monthlyRevenue) {
//     graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
//   }
//   return graphData;
// };

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
