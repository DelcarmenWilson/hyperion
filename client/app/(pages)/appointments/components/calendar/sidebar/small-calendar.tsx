import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppointmentContext } from "@/providers/app";
import { getMonth } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

export default function SmallCalendar() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  const { monthIndex, setSmallCalendarMonth, setDaySelected, daySelected } =
    useAppointmentContext();

  useEffect(() => {
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  const handleMonth = (e: number) => {
    setCurrentMonthIdx(currentMonthIdx + e);
  };

  function getDayClass(day: dayjs.Dayjs) {
    const format = "DD-MM-YY";
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    const slcDay = daySelected && daySelected.format(format);
    if (nowDay === currDay) {
      return "text-primary font-bold";
    } else if (currDay === slcDay) {
      return "bg-primary rounded-full text-background";
    } else {
      return "";
    }
  }
  return (
    <div className="mt-9">
      <header className="flex justify-between items-center">
        <p className="text-gray-500 font-bold">
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format("MMMM YYYY")}
        </p>
        <div>
          <Button variant="ghost" size="icon" onClick={() => handleMonth(-1)}>
            <ChevronLeft size={16} />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => handleMonth(1)}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-7 grid-rows-6">
        {currentMonth[0].map((day, i) => (
          <span key={i} className="text-sm py-1 text-center">
            {day.format("dd").charAt(0)}
          </span>
        ))}
        {currentMonth.map((row, i) => (
          <>
            {row.map((day, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSmallCalendarMonth(currentMonthIdx);
                  setDaySelected(day);
                }}
                className={`py-1 w-full ${getDayClass(day)}`}
              >
                <span className="text-sm">{day.format("D")}</span>
              </button>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
