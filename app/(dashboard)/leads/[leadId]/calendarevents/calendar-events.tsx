"use client";

import { Appointment } from "@prisma/client";
import { CalendarBox } from "./calendar-box";

interface CalendarEventsProps {
  appointments: Appointment[];
}

export const CalendarEvents = ({ appointments }: CalendarEventsProps) => {
  return (
    <div className="text-sm">
      <div className="grid grid-cols-3 items-center  gap-2 text-md text-muted-foreground">
        <span>Date / Time</span>
        <span>Status</span>
        <span>Comments</span>
      </div>

      {appointments?.map((appointment) => (
        <CalendarBox key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
};
