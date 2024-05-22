import React, { useState, useEffect } from "react";
import { useAppointmentContext } from "@/providers/app";
import dayjs from "dayjs";
import { Appointment } from "@prisma/client";
import { format } from "date-fns";
import { getAppLabelBgColor } from "@/formulas/labels";

type DayProps = {
  day: dayjs.Dayjs;
  rowIdx: number;
};

export const Day = ({ day, rowIdx }: DayProps) => {
  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([]);
  const {
    setDaySelected,
    setShowAppointmentModal,
    filteredAppointments,
    setSelectedAppointment,
  } = useAppointmentContext();

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
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1">{day.format("ddd").toUpperCase()}</p>
        )}
        <p className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}>
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
        {dayAppointments.map((app, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedAppointment(app)}
            className={`${getAppLabelBgColor(
              app.label
            )}  p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
          >
            {app.title} - {format(app.startDate, "h:mm")}
          </div>
        ))}
      </div>
    </div>
  );
};
