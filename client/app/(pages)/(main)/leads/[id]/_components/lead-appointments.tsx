"use client";
import { useLeadAppointmentData } from "@/hooks/lead/use-appointment";
import { cn } from "@/lib/utils";

import { Appointment } from "@prisma/client";

import { formatDateTime } from "@/formulas/dates";

//TODO - need to give some TLC to this Component
const LeadAppointments = () => {
  const { appointments } = useLeadAppointmentData();
  return (
    <div className="text-sm">
      <div className="grid grid-cols-4 items-center  gap-2 text-md text-muted-foreground">
        <span>Date / Time</span>
        <span>Status</span>
        <span className="col-span-2">Comments</span>
      </div>

      {appointments?.map((appointment) => (
        <AppointmentsCard key={appointment.id} appointment={appointment} />
      ))}
      {!appointments && (
        <p className="text-muted-foreground text-center mt-2">
          No appointments found
        </p>
      )}
    </div>
  );
};

const AppointmentsCard = ({ appointment }: { appointment: Appointment }) => {
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

export default LeadAppointments;
