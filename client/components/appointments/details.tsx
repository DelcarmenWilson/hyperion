"use client";
import { useEffect, useState } from "react";
import { useAppointmentStore } from "@/hooks/use-appointment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";
import { CustomDialog } from "../global/custom-dialog";
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

export const AppointmentDetails = () => {
  const queryClient = useQueryClient();
  const { isDetailsOpen, onDetailsClose, appointment } = useAppointmentStore();
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

  useEffect(() => {
    setStatus(appointment?.status);
  }, [appointment]);

  if (!appointment) return null;
  const lead = appointment.lead;

  return (
    <CustomDialog
      open={isDetailsOpen}
      onClose={onDetailsClose}
      title="Appointment Details"
      description="Appointment Details Form"
    >
      <p className="text-xl">
        <span>Lead: </span>
        <span>
          {lead.firstName} {lead.lastName}
        </span>
      </p>
      <CardData
        label="Date"
        value={formatDate(appointment.startDate, "MM-dd-yy")}
      />
      <CardData
        label="Lead Date"
        value={formatDateTime(appointment.localDate)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        <CardData
          label="Start Time"
          value={formatTime(appointment.startDate)}
        />
        <CardData
          label="End Time"
          value={formatTime(appointment.endDate as Date, "hh:mm aaaa")}
        />
      </div>

      {appointment.status == "Scheduled" ? (
        <div className="flex items-center gap-2">
          <p className="font-semibold">Status:</p>
          <Select
            name="ddlStatus"
            onValueChange={setStatus}
            defaultValue={status}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {appointmentStatus.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <CardData label="Status" value={appointment.status} />
      )}

      <CardData label="Phone #" value={formatPhoneNumber(lead.cellPhone)} />
      <CardData label="Email" value={lead.email} />
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
    </CustomDialog>
  );
};
