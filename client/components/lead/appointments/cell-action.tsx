"use client";
import { ClipboardList, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { FullAppointment } from "@/types";
import { CopyButton } from "@/components/reusable/copy-button";
import { useAppointment } from "@/hooks/use-appointment";

export const CellAction = ({
  appointment,
}: {
  appointment: FullAppointment;
}) => {
  const { onDetailsOpen } = useAppointment();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            className="justify-between"
            onClick={() => onDetailsOpen(appointment)}
          >
            Details
            <ClipboardList size={16} />
          </DropdownMenuItem>

          <DropdownMenuItem className=" justify-between">
            Copy Id
            <CopyButton value={appointment.id} message="Appointment Id" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
