"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type OverviewChartProps = {
  data: any[];
  title: string;
  tooltip?: boolean;
  tooltipFill?: string;
  legend?: boolean;
  gradient?: boolean;
};
export const OverviewChart = ({
  data,
  title,
  tooltip = false,
  tooltipFill = "transparent",
  legend = false,
  gradient = false,
}: OverviewChartProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            {tooltip && <Tooltip cursor={{ fill: tooltipFill }} />}
            {legend && <Legend />}
            <Bar
              dataKey="total"
              radius={[4, 4, 0, 0]}
              fillOpacity={1}
              fill={gradient ? "url(#colorUv)" : "fill-primary"}
              className={gradient ? "" : "fill-primary"}
            />
            {/* <Bar dataKey="total" fill={cn("bg-background")} radius={[4, 4, 0, 0]} /> */}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

type SriniChartProps = {
  data: any[];
  grid?: boolean;
  title: string;
  legend?: boolean;
  menu?: React.ReactNode;
  maxVal?: number;
};
export const SriniChart = ({
  data,
  grid = false,
  title,
  legend = false,
  menu,
  maxVal = 1000,
}: SriniChartProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>{title}</CardTitle>

        {menu}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            {grid && <CartesianGrid strokeDasharray="3 3" />}

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
              domain={[0, maxVal]}
            />
            <Tooltip />

            {legend && <Legend />}
            <Bar dataKey="total" fill="currentColor">
              <LabelList
                dataKey="total"
                position="top"
                offset={0}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
