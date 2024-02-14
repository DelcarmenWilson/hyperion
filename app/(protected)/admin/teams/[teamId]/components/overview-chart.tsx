"use client";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type OverviewChartProps = {
  data: any[];
};
export const OverviewChart = ({ data }: OverviewChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
        {/* <Bar dataKey="total" fill={cn("bg-background")} radius={[4, 4, 0, 0]} /> */}
      </BarChart>
    </ResponsiveContainer>
  );
};
