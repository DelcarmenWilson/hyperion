"use client";

import { Appointment } from "@prisma/client";
import { CalendarBox } from "./calendar-box";

type CalendarEventsProps = {
  appointments: Appointment[];
};

export const CalendarEvents = ({ appointments }: CalendarEventsProps) => {
  return (
    <div className="text-sm">
      <div className="grid grid-cols-4 items-center  gap-2 text-md text-muted-foreground">
        <span>Date / Time</span>
        <span>Status</span>
        <span className="col-span-2">Comments</span>
      </div>

      {appointments?.map((appointment) => (
        <CalendarBox key={appointment.id} appointment={appointment} />
      ))}
      {!appointments.length && (
        <p className="text-muted-foreground text-center mt-2">
          No appointments found
        </p>
      )}
    </div>
  );
};
