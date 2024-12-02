"use client";
import { useLeadAppointmentData } from "@/hooks/lead/use-appointment";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDateTime } from "@/formulas/dates";

export const AppointmentClient = () => {
  const { appointments, isFetchingAppointments } = useLeadAppointmentData();
  return (
    <div className="text-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date / Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comments</TableHead>
          </TableRow>
        </TableHeader>
        <SkeletonWrapper isLoading={isFetchingAppointments} fullWidth>
          <TableBody>
            {appointments?.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{formatDateTime(appointment.startDate)}</TableCell>
                <TableCell
                  className={
                    appointment.status == "Rescheduled"
                      ? "text-destructive"
                      : ""
                  }
                >
                  {appointment.status}
                </TableCell>
                <TableCell>{appointment.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </SkeletonWrapper>
      </Table>
      {!appointments?.length && (
        <p className="text-muted-foreground text-center mt-2">
          No appointments found
        </p>
      )}
    </div>
  );
};
