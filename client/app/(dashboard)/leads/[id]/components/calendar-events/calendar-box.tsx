"use client";

import { formatDateTime } from "@/formulas/dates";
import { cn } from "@/lib/utils";
import { Appointment } from "@prisma/client";

export const CalendarBox = ({ appointment }: { appointment: Appointment }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-2 border-b py-2">
      <div>{formatDateTime(appointment.startDate)}</div>
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
