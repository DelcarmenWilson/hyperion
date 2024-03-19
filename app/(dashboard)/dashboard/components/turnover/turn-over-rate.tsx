"use client";
import { useState } from "react";
import { CardLayout } from "@/components/custom/card/layout";
import { PieChart } from "lucide-react";
import { DateRangePicker } from "@/components/custom/date-range-picker";
import { weekStartEnd } from "@/formulas/dates";

export const TurnOverRate = () => {
  const [dates, setDates] = useState(weekStartEnd());
  const onDateSelected = (e: any) => {
    setDates(e);
  };
  return (
    <CardLayout title="Turn over Rate" icon={PieChart}>
      <p className="text-muted-foreground">Date Range</p>
      <DateRangePicker date={dates} setDate={onDateSelected} className="flex" />
    </CardLayout>
  );
};
