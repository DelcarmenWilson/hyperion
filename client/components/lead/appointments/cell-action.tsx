"use client";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FullAppointment } from "@/types";
import { AppointmentStatus } from "@/types/appointment";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import CancelAppointmentDialog from "./cancel-appointment-dialog";
import { AppointmentDetails } from "./details-appointment-dialog";

export const CellAction = ({
  appointment,
}: {
  appointment: FullAppointment;
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open appointment menu</span>
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <AppointmentDetails
              status={appointment.status}
              firstName={appointment.lead.firstName}
              lastName={appointment.lead.lastName}
              startDate={appointment.startDate}
              localDate={appointment.localDate}
              cellPhone={appointment.lead.cellPhone}
              email={appointment.lead.email}
              comments={appointment.comments}
              reason={appointment.reason}
            />
          </DropdownMenuItem>

          {appointment.status === AppointmentStatus.SCHEDULED && (
            <DropdownMenuItem asChild>
              <CancelAppointmentDialog appointmentId={appointment.id} />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
