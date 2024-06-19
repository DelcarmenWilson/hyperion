"use client";
import { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { toast } from "sonner";
import { CalendarX, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert";
import { FullAppointment } from "@/types";
import { DrawerRight } from "@/components/custom/drawer-right";
import { CopyButton } from "@/components/reusable/copy-button";
import { AppointmentForm } from "./form";
import { appointmentUpdateByIdClosed } from "@/actions/appointment";

export const CellAction = ({
  appointments,
}: {
  appointments: FullAppointment;
}) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onClosed = async () => {
    try {
      setLoading(true);
      const updatedAppointment = await appointmentUpdateByIdClosed(
        appointments.id
      );
      if (updatedAppointment.success) {
        userEmitter?.emit("appointmentClosed", appointments.id);
        toast.success("Appointment Succesfully Closed!!");
      } else {
        toast.success(updatedAppointment.error);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onClosed}
        loading={loading}
        height="h-[400px]"
      />
      <DrawerRight
        title={"Appointment"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <AppointmentForm
          appointment={appointments}
          onClose={() => setIsDrawerOpen(false)}
        />
      </DrawerRight>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {appointments.status == "Scheduled" && (
            <DropdownMenuItem
              className=" justify-between"
              onClick={() => setAlertOpen(true)}
            >
              Close <CalendarX size={16} />
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className=" justify-between">
            Copy Id
            <CopyButton value={appointments.id} message="Appointment Id" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
