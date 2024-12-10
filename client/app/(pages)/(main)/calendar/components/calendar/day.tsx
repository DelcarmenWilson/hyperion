import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/stores/calendar-store";
import { useCalendarData } from "@/hooks/calendar/use-calendar";

import { CalendarAppointment } from "@/types/appointment";
import { HyperionColors } from "@/lib/colors";

export const labelColors = {
  [HyperionColors.INDIGO]: "bg-indigo-200",
  [HyperionColors.GRAY]: "bg-gray-200",
  [HyperionColors.GREEN]: "bg-green-200",
  [HyperionColors.BLUE]: "bg-blue-200",
  [HyperionColors.RED]: "bg-red-200",
  [HyperionColors.PURPLE]: "bg-purple-200",
  [HyperionColors.PRIMARY]: "bg-primary text-background",
};

type DayProps = {
  day: dayjs.Dayjs;
  rowIdx: number;
};

export const Day = ({ day, rowIdx }: DayProps) => {
  const [dayAppointments, setDayAppointments] = useState<CalendarAppointment[]>(
    []
  );
  const { setDaySelected, setShowAppointmentModal, setSelectedAppointment } =
    useCalendarStore();
  const { filteredAppointments } = useCalendarData();

  useEffect(() => {
    const events = filteredAppointments.filter(
      (app) =>
        dayjs(app.startDate).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setDayAppointments(events);
  }, [filteredAppointments, day]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-primary text-background rounded-full w-7"
      : "";
  }
  return (
    <div className="border flex flex-col overflow-hidden p-1">
      <header className="flex flex-col gap-1 items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1">{day.format("ddd").toUpperCase()}</p>
        )}
        <p className={cn("text-sm p-1 text-center", getCurrentDayClass())}>
          {day.format("DD")}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setShowAppointmentModal(true);
        }}
      >
        {dayAppointments.map((app) => (
          <div
            key={app.id}
            className={cn(
              "text-xs truncate",
              labelColors[app.label?.color as HyperionColors]
            )}
            onClick={() => setSelectedAppointment(app)}
          >
            {app.lead ? app.lead.firstName : app.title} -{" "}
            {format(app.startDate, "h:mm")}
          </div>
        ))}
      </div>
    </div>
  );
};
