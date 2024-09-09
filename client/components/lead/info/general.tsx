import { useEffect, useState } from "react";
import { CalendarX, FilePenLine, Phone } from "lucide-react";
import { userEmitter } from "@/lib/event-emmiter";
import { useLead } from "@/hooks/use-lead";
import { cn } from "@/lib/utils";

import { Appointment } from "@prisma/client";
import { LeadGeneralSchemaType } from "@/schemas/lead";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/reusable/input-group";

import { formatDateTime, formatDob, getAge } from "@/formulas/dates";

type Props = {
  info: LeadGeneralSchemaType;
  leadName: string;
  lastCall?: Date;
  nextAppointment?: Date;
  showInfo?: boolean;
  showEdit?: boolean;
};

export const GeneralInfoClient = ({
  info,
  leadName,
  lastCall,
  nextAppointment,
  showInfo = false,
  showEdit = true,
}: Props) => {
  const [generalInfo, setGeneralInfo] = useState<LeadGeneralSchemaType>(info);
  const { onGeneralFormOpen } = useLead();

  useEffect(() => {
    const onSetInfo = (e: LeadGeneralSchemaType) => {
      if (e.id == info.id) setGeneralInfo(e);
    };
    const onSetLastCall = (leadId: string) => {
      if (leadId == info.id)
        setGeneralInfo((info) => {
          return { ...info, lastCall: new Date() };
        });
    };
    const onSetNextAppointment = (e: Appointment) => {
      if (e.leadId == info.id)
        setGeneralInfo((info) => {
          return { ...info, nextAppointment: e.startDate };
        });
    };
    setGeneralInfo(info);
    userEmitter.on("generalInfoUpdated", (info) => onSetInfo(info));
    userEmitter.on("appointmentScheduled", (newAppointment) =>
      onSetNextAppointment(newAppointment)
    );
    userEmitter.on("newCall", (leadId) => onSetLastCall(leadId));
  }, [info]);

  return (
    <>
      <div className="flex flex-col gap-2 text-sm">
        {lastCall && (
          <div
            className={cn(
              "flex items-center  gap-1",
              !showInfo && "flex-col items-start"
            )}
          >
            <Badge className="gap-1 w-fit">
              <Phone size={16} /> Last Call
            </Badge>
            {formatDateTime(lastCall)}
          </div>
        )}

        {nextAppointment && (
          <div
            className={cn(
              "flex items-center  gap-1",
              !showInfo && "flex-col items-start"
            )}
          >
            <Badge className="gap-1 w-fit">
              <CalendarX size={16} /> Appt Set
            </Badge>
            {formatDateTime(nextAppointment)}
          </div>
        )}

        {showInfo && (
          <div>
            <div className="relative group">
              <div className="flex gap-1">
                <InputGroup
                  title="Dob"
                  value={formatDob(generalInfo.dateOfBirth)}
                />
                {generalInfo.dateOfBirth && (
                  <span className="font-semibold">
                    - {getAge(generalInfo.dateOfBirth)} yrs.
                  </span>
                )}
              </div>
              <InputGroup
                title="Height"
                value={generalInfo.height?.toString() || ""}
              />
              <div className="flex gap-1">
                <InputGroup
                  title="Weight"
                  value={generalInfo.weight?.toString() || ""}
                />
                lbs
              </div>
              <p>Smoker: {generalInfo.smoker ? "Yes" : "No"}</p>
              <InputGroup
                title="Income"
                value={generalInfo.income?.toString() || ""}
              />
              <InputGroup title="Gender" value={generalInfo.gender} />
              <InputGroup
                title="Marital Status"
                value={generalInfo.maritalStatus}
              />
              {showEdit && (
                <Button
                  className="absolute translate-y-1/2 top-0 right-0 rounded-full lg:opacity-0 group-hover:opacity-100"
                  onClick={() => onGeneralFormOpen(generalInfo.id)}
                >
                  <FilePenLine size={16} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
