"use client";
import { useLeadData } from "@/hooks/use-lead";
import { CalendarBox } from "./card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const AppointmentClient = () => {
  const { appointments, isFetchingAppointments } = useLeadData();
  return (
    <div className="text-sm">
      <div className="grid grid-cols-4 items-center  gap-2 text-md text-muted-foreground">
        <span>Date / Time</span>
        <span>Status</span>
        <span className="col-span-2">Comments</span>
      </div>

      <SkeletonWrapper isLoading={isFetchingAppointments}>
        {appointments?.map((appointment) => (
          <CalendarBox key={appointment.id} appointment={appointment} />
        ))}
        {!appointments?.length && (
          <p className="text-muted-foreground text-center mt-2">
            No appointments found
          </p>
        )}
      </SkeletonWrapper>
    </div>
  );
};
