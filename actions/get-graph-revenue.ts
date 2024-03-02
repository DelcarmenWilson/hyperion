import { Sales } from "@/types";

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

export const getGraphRevenue = (sales: Sales[]) => {
  
  const monthlyRevenue: { [key: number]: number } = {};

  for (const sale of sales) {
    const month = sale.updatedAt.getMonth();
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + sale.saleAmount;
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
