import React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

import { AppointmentStatus } from "@/types/appointment";

import { PageLayout } from "@/components/custom/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/formulas/dates";
import { getAppointment } from "@/actions/appointment";
import AlertError from "@/components/custom/alert-error";
import CancelAppointmentDialog from "@/components/lead/appointments/cancel-appointment-dialog";
import Link from "next/link";

const AppointmentStatusColors = {
  [AppointmentStatus.CANCELLED]: "bg-orange-500 hover:bg-orange-200",
  [AppointmentStatus.CLOSED]: "bg-blue-500 hover:bg-blue-200",
  [AppointmentStatus.NO_SHOW]: "bg-red-500 hover:bg-red-200",
  [AppointmentStatus.RESCHEDULED]: "bg-yellow-500 hover:bg-yellow-200",
  [AppointmentStatus.SCHEDULED]: "",
};

const AppointmentPage = ({ params }: { params: { appointmentid: string } }) => {
  return (
    <PageLayout title="Appointment Details" icon={Calendar}>
      <Appointment appointmentId={params.appointmentid} />
    </PageLayout>
  );
};

const Appointment = async ({ appointmentId }: { appointmentId: string }) => {
  const appointment = await getAppointment(appointmentId);
  if (!appointment) return <AlertError />;
  const { id, comments, reason, status, startDate, localDate, lead } =
    appointment;
  return (
    <div>
      <Badge
        className={cn(
          "absolute top-0 right-1 flex-center",
          AppointmentStatusColors[status as AppointmentStatus]
        )}
      >
        {status}
      </Badge>

      <p className="text-center text-5xl text-primary font-bold">
        {lead.firstName} {lead.lastName}
      </p>

      {status == AppointmentStatus.SCHEDULED && (
        <div className="w-[200px]">
          <CancelAppointmentDialog
            appointmentId={id}
            triggerText="Cancel Appointment"
          />
        </div>
      )}
      <Link href={`/leads/${lead.id}`}>Lead Details</Link>

      <div className="grid grid-cols-2 gap-y-1">
        <Box title="Start Date" value={formatDate(startDate)} />
        <Box title="Start Time" value={formatTime(startDate)} />
        <Box title="Lead Date" value={formatDate(localDate)} />
        <Box title="Lead Time" value={formatTime(localDate)} />
        <Box title="Phone#" value={lead.cellPhone} />
        <Box title="Email" value={lead.email || ""} />
      </div>
      <p>
        <Box title="Comments" value={comments || ""} />
      </p>
      {reason && (
        <p>
          <Box title="Reason" value={reason} />
        </p>
      )}
    </div>
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

export default AppointmentPage;
