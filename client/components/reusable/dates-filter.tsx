"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { weekStartEnd } from "@/formulas/dates";
import { DateRangePicker } from "@/components/custom/date-range-picker";
import { Button } from "@/components/ui/button";

type DatesFilterProps = {
  link: string;
};

export const DatesFilter = ({ link }: DatesFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const searchDates = {
    from: new Date(searchParams.get("from") as string),
    to: new Date(searchParams.get("to") as string),
  };

  const [dates, setDates] = useState(from ? searchDates : weekStartEnd());

  const onDateSelected = (e: any) => {
    setDates(e);
  };

  const onUpdate = () => {
    router.push(
      `${link}?from=${dates.from.toLocaleDateString()}&to=${dates.to.toLocaleDateString()}`
    );
    router.refresh();
  };

  return (
    <div className="w-full col-span-3 flex flex-col lg:flex-row justify-end items-end gap-2">
      <DateRangePicker setDate={onDateSelected} date={dates} className="flex" />
      <Button onClick={onUpdate}>Update</Button>
    </div>
  );
};
