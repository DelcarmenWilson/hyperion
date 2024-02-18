"use client";

import { cn } from "@/lib/utils";
import { Appointment } from "@prisma/client";
import { format } from "date-fns";

interface CalendarBoxProps {
  appointment: Appointment;
}

export const CalendarBox = ({ appointment }: CalendarBoxProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-2 border-b py-2">
      <div>{format(appointment.date, "MM-dd-yy hh:mm aa")}</div>
      <div
        className={cn(
          appointment.status == "Rescheduled" && "text-destructive"
        )}
      >
        {appointment.status}
      </div>
      <div className="col-span-2">{appointment.comments}</div>
    </div>
  );
};
