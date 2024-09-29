import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useCalendarStore } from "@/hooks/calendar/use-calendar-store";
import { useCalendarData } from "@/hooks/calendar/use-calendar";

import { getAppLabelBgColor } from "@/formulas/labels";
import { format } from "date-fns";
import { CalendarAppointment } from "@/types/appointment";
import { cn } from "@/lib/utils";

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
        {dayAppointments.map((app) => {
          const bg = getAppLabelBgColor(app.label?.color as string);
          return (
            <div
              key={app.id}
              className={cn("text-sm truncate", bg)}
              onClick={() => setSelectedAppointment(app)}
              //TODO need to gt the label color here
              // className={`${getAppLabelBgColor(
              //   app.label
              // )}  p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
            >
              {app.lead ? app.lead.firstName : app.title} -{" "}
              {format(app.startDate, "h:mm")}
            </div>
          );
        })}
      </div>
    </div>
  );
};
