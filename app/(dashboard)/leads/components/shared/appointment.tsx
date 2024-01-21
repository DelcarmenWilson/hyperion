import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Cake, CalendarX, Plus, XCircle } from "lucide-react";

interface AppointmentProps {
  dob?: Date;
  showInfo?: boolean;
}
export const Appointment = ({ dob, showInfo = false }: AppointmentProps) => {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p>Last Called: 8-16 4:19 pm</p>

      <div className="flex gap-1">
        <CalendarX className="h-4 w-4" />
        Appt: on 8-18 4:00 pm
      </div>

      <Badge className="flex gap-1 w-fit">
        Appt Set <XCircle className="h-4 w-4" />
      </Badge>

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
          <p>Height: 5'7</p>
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
