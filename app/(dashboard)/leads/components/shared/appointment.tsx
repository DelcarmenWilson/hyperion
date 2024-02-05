import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Appointment, Call } from "@prisma/client";
import { format } from "date-fns";
import { Cake, CalendarX, Plus, XCircle } from "lucide-react";

interface AppointmentProps {
  call: Call;
  appointment: Appointment;
  dob?: Date;
  showInfo?: boolean;
}
export const AppointmentBox = ({
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
          <p>Country: Meckenburg</p>
          <p>Height: 5&apos;7</p>
          <p>Weight: 153 lbs</p>
          <p>Smoker: No</p>
          <p>Income: $46524.00</p>
        </div>
      )}

      {showInfo && (
        <Button className="flex gap-1 w-fit" variant="secondary">
          <Plus className="h-4 w-4" />
          NEW FIELD
        </Button>
      )}
    </div>
  );
};
