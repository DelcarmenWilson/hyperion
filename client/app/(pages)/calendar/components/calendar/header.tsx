import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendarStore } from "@/hooks/calendar/use-calendar-store";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex } = useCalendarStore();

  const handleMonth = (e: number) => {
    setMonthIndex(monthIndex + e);
  };

  const handleReset = () => {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    );
  };
  return (
    <header className="px-4 py-2 flex items-center">
      {/* <img src={logo} alt="calendar" className="mr-2 w-12 h-12" /> */}
      <h1 className="mr-10 text-xl text-muted-foreground fond-bold">
        Calendar
      </h1>
      <Button variant="ghost" onClick={handleReset}>
        Today
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleMonth(-1)}>
        <ChevronLeft size={16} />
      </Button>

      <Button variant="ghost" size="icon" onClick={() => handleMonth(1)}>
        <ChevronRight size={16} />
      </Button>

      <h2 className="ml-4 text-xl font-bold">
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </h2>
    </header>
  );
}
