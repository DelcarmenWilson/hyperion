"use client";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { FullAppointment } from "@/types";

import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatPhoneNumber } from "@/formulas/phones";
import { formatDate, formatDateTime, formatTime } from "@/formulas/dates";
import { appointmentStatus } from "@/constants/texts";
import { appointmentUpdateByIdStatus } from "@/actions/appointment";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Calendar, ClipboardList } from "lucide-react";
import { AppointmentStatus } from "@/types/appointment";
import { capitalize } from "@/formulas/text";
import { getEnumValues } from "@/lib/helper/enum-converter";
import { DataDisplay } from "@/components/global/data-display/data-display";

export const AppointmentDetails = ({
  appointment,
}: {
  appointment: FullAppointment;
}) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(appointment?.status);

  const { mutate, isPending } = useMutation({
    mutationFn: appointmentUpdateByIdStatus,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("appointment has been updated!!!", {
          id: "appointment-update",
        });
        queryClient.invalidateQueries({
          queryKey: ["agentAppointments"],
        });
      }
    },
  });

  const statuses = getEnumValues(AppointmentStatus);

  if (!appointment) return null;

  const { lead, startDate, endDate, localDate } = appointment;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-between items-center">
          <span className="sr-only">Appointment Detials</span>
          <span>Detials</span> <ClipboardList size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={Calendar}
          title="Appointment details"
          subTitle="Start building your workflow"
        />
        <div>
          <p className="text-xl text-center font-bold">
            {lead.firstName} {lead.lastName}
          </p>

          <DataDisplay
            title="Lead Date"
            value={startDate ? formatDateTime(startDate, "MM-dd-yy") : "No set"}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 ">
            <DataDisplay
              title="Lead Date"
              value={
                localDate
                  ? formatDateTime(localDate, "MM-dd-yy h:mm aa")
                  : "No set"
              }
            />

            <DataDisplay
              title="Start Time"
              value={startDate ? formatTime(startDate, "MM-dd-yy") : "No set"}
            />

            <DataDisplay
              title="End Time"
              value={endDate ? formatTime(endDate) : "No set"}
            />
          </div>

          <div className="flex items-center gap-2">
            <p className="font-semibold">Status:</p>
            <Select
              name="ddlStatus"
              onValueChange={setStatus}
              defaultValue={status}
              disabled={appointment.status != AppointmentStatus.SCHEDULED}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="w-[200px]">
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <span>{capitalize(status.name)}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DataDisplay
            title="Phone #"
            value={formatPhoneNumber(lead.cellPhone)}
          />
          <DataDisplay title="Email" value={lead.email || "N?A"} />

          {appointment.status != status && (
            <Button
              disabled={isPending}
              onClick={() =>
                mutate({ id: appointment.id, status: status as string })
              }
            >
              Save
            </Button>
          )}
        </div>{" "}
      </DialogContent>
    </Dialog>
  );
};
