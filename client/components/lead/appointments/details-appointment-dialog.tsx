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
import {
  AppointmentStatus,
  AppointmentStatusColors,
} from "@/types/appointment";
import { capitalize } from "@/formulas/text";
import { getEnumValues } from "@/lib/helper/enum-converter";
import { DataDisplay } from "@/components/global/data-display/data-display";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Props={status:string;
  firstName:string;
  lastName:string;
  startDate:Date;
  localDate:Date;
  cellPhone:string;
  email:string|null;
  comments:string|null
  reason: string|null
}

export const AppointmentDetails = ({status,
  firstName,
  lastName,
  startDate,
  localDate,
  cellPhone,
  email,
  comments,
  reason
}: Props) => {
const [open, setOpen] = useState(false);


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
          // subTitle="Start building your workflow"
        />
        <ScrollArea className="max-h-[400px] relative">
         
          <Badge
            className={cn(
              "absolute top-0 right-1",
              AppointmentStatusColors[status as AppointmentStatus]
            )}
          >
            {status}
          </Badge>
          <p className="font-semibold mb-1">
            <span>Name: </span>
            <span>
              {firstName} {lastName}           </span>
          </p>
          <div className="grid grid-cols-2 gap-y-1">
            <Box title="Start Date" value={formatDate(startDate)} />
            <Box title="Start Time" value={formatTime(startDate)} />
            <Box title="Lead Date" value={formatDate(localDate)} />
            <Box title="Lead Time" value={formatTime(localDate)} />
            <Box title="Phone#" value={cellPhone} />
            <Box title="Email" value={email || ""} />
          </div>
          <p>
            <Box title="Comments" value={comments || ""} />
          </p>
          {reason && (
            <p>
              <Box title="Reason" value={reason} />
            </p>
          )}
          {/* <pre>{JSON.stringify(appointment, null, 4)}</pre> */}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const Box = ({ title, value }: { title: string; value: string }) => {
  return (
    <p>
      <span className="font-semibold">{title}: </span>
      <span className="text-muted-foreground">{value}</span>
    </p>
  );
};
