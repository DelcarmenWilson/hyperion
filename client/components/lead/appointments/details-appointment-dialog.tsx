"use client";
import { useState } from "react";
import { Calendar, ClipboardList } from "lucide-react";

import { cn } from "@/lib/utils";

import { AppointmentStatus } from "@/types/appointment";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formatDate, formatTime } from "@/formulas/dates";

const AppointmentStatusColors = {
  [AppointmentStatus.CANCELLED]: "bg-orange-500 hover:bg-orange-200",
  [AppointmentStatus.CLOSED]: "bg-blue-500 hover:bg-blue-200",
  [AppointmentStatus.NO_SHOW]: "bg-red-500 hover:bg-red-200",
  [AppointmentStatus.RESCHEDULED]: "bg-yellow-500 hover:bg-yellow-200",
  [AppointmentStatus.SCHEDULED]: "",
};

type Props = {
  status: string;
  firstName: string;
  lastName: string;
  startDate: Date;
  localDate: Date;
  cellPhone: string;
  email: string | null;
  comments: string | null;
  reason: string | null;
};

export const AppointmentDetails = ({
  status,
  firstName,
  lastName,
  startDate,
  localDate,
  cellPhone,
  email,
  comments,
  reason,
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
              "absolute top-0 right-1 flex-center",
              AppointmentStatusColors[status as AppointmentStatus]
            )}
          >
            {status}
          </Badge>
          <p className="font-semibold mb-1">
            <span>Name: </span>
            <span>
              {firstName} {lastName}{" "}
            </span>
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
