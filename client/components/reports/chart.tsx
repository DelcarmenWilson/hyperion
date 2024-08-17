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
  legend?: boolean;
};
export const OverviewChart = ({
  data,
  title,
  tooltip = true,
  legend = true,
}: OverviewChartProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
            {tooltip && <Tooltip />}
            {legend && <Legend />}
            <Bar
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
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
