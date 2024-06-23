"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { weekStartEnd } from "@/formulas/dates";
import { DateRangePicker } from "@/components/custom/date-range-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

type DatesFilterProps = {
  link: string;
  colSpan?: boolean;
  onDateSelected?: (e: DateRange) => void;
};

export const DatesFilter = ({
  link,
  colSpan = false,
  onDateSelected,
}: DatesFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const searchDates = {
    from: new Date(searchParams.get("from") as string),
    to: new Date(searchParams.get("to") as string),
  };

  const [dates, setDates] = useState<DateRange | undefined>(
    from ? searchDates : weekStartEnd()
  );

  const onUpdate = () => {
    if (!dates) return;
    router.push(
      `${link}?from=${dates.from?.toLocaleDateString()}&to=${dates.to?.toLocaleDateString()}`
    );

    if (onDateSelected) onDateSelected(dates);
  };

  return (
    <div
      className={cn(
        "w-full col-span-3 flex flex-col lg:flex-row justify-end items-end gap-2",
        colSpan && "col-span-2"
      )}
    >
      <DateRangePicker setDate={setDates} date={dates} className="flex" />
      <Button onClick={onUpdate}>Update</Button>
    </div>
  );
};
