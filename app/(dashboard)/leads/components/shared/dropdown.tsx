"use client";
import { Calendar, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAppointmentModal } from "@/hooks/use-appointment-modal";
import { LeadColumn } from "../columns";

interface DropDownDrops {
  lead: LeadColumn;
}

export const DropDown = ({ lead }: DropDownDrops) => {
  const useAppointment = useAppointmentModal();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="rounded-full" size="icon">
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="center">
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Button variant="ghost" onClick={() => useAppointment.onOpen(lead)}>
            <Calendar className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
