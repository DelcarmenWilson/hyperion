import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAge } from "@/formulas/dates";
import { FullLead, FullLeadNoConvo } from "@/types";
import { Appointment, Call } from "@prisma/client";
import { format } from "date-fns";
import { Cake, CalendarX, Plus, XCircle } from "lucide-react";

type AppointmentProps = {
  lead: FullLead | FullLeadNoConvo;
  call?: Call;
  appointment?: Appointment;
  dob?: Date;
  showInfo?: boolean;
};
export const AppointmentBox = ({
  lead,
  call,
  appointment,
  dob,
  showInfo = false,
}: AppointmentProps) => {
  return (
    <div className="flex flex-col gap-2 text-sm">
      {call && (
        <p>Last Called: {format(call.createdAt, "MM-dd-yy HH:mm aaaa")}</p>
      )}

      {appointment && (
        <div>
          <div className="flex gap-1">
            <CalendarX className="h-4 w-4" />
            Appt: on {format(appointment.date, "MM-dd-yy HH:mm aaaa")}
          </div>
          <Badge className="flex gap-1 w-fit">
            Appt Set <XCircle className="h-4 w-4" />
          </Badge>
        </div>
      )}

      {dob && (
        <div className="flex items-center gap-1 w-fit">
          <Cake className="h-4 w-4 mr-1" />
          <XCircle className="h-4 w-4 mr-1" />
          Birthday: {format(dob!, "MM/dd/yy")}
        </div>
      )}

      {showInfo && (
        <div>
          <p>
            Dob: {lead.dateOfBirth && format(lead.dateOfBirth, "MM/dd/yy")}
            {lead.dateOfBirth ? (
              <span className="font-semibold">
                {" "}
                - {getAge(lead.dateOfBirth)} yrs.
              </span>
            ) : (
              <span className="text-destructive">Not set</span>
            )}
          </p>
          <Box title="Height" value={lead.height!} />
          <p>
            Weight:
            {lead.weight ? (
              <span>{lead.weight} lbs</span>
            ) : (
              <span className="text-destructive">Not set</span>
            )}{" "}
          </p>
          <p>Smoker: {lead.smoker ? "Yes" : "No"}</p>
          <Box
            title="Income"
            value={lead.income ? lead.income.toString() : ""}
          />
          <Box title="Gender" value={lead.gender} />
          <Box title="Marital Status" value={lead.maritalStatus} />
        </div>
      )}

      {/* {showInfo && (
        <Button className="flex gap-1 w-fit" variant="secondary">
          <Plus className="h-4 w-4" />
          NEW FIELD
        </Button>
      )} */}
    </div>
  );
};
type BoxProps = {
  title: string;
  value: string;
};
const Box = ({ title, value }: BoxProps) => {
  return (
    <p>
      {title}:
      {value ? (
        <span> {value}</span>
      ) : (
        <span className="text-destructive"> Not set</span>
      )}
    </p>
  );
};
