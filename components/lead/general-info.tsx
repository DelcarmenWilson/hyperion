import { useEffect, useState } from "react";
import {
  Cake,
  CalendarX,
  FilePenLine,
  Phone,
  Plus,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextGroup } from "@/components/reusable/input-group";
import { GeneralInfoForm } from "./forms/general-info-form";

import { LeadGeneralInfo } from "@/types";
import { Appointment, Call } from "@prisma/client";

import { getAge } from "@/formulas/dates";

type GeneralInfoClientProps = {
  info: LeadGeneralInfo;
  call?: Call;
  appointment?: Appointment;
  dob?: Date;
  showInfo?: boolean;
};
export const GeneralInfoClient = ({
  info,
  call,
  appointment,
  dob,
  showInfo = false,
}: GeneralInfoClientProps) => {
  const [edit, setEdit] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadGeneralInfo>(info);

  const onSetInfo = (e?: LeadGeneralInfo) => {
    if (e) {
      setLeadInfo(e);
    }
    setEdit(false);
  };
  useEffect(() => {
    setLeadInfo(info);
  }, [info]);
  return (
    <div className="flex flex-col gap-2 text-sm">
      {call && (
        <div className="flex items-center  gap-1">
          <Badge className="gap-1 w-fit">
            <Phone size={16} /> Last Call
          </Badge>
          {format(call.createdAt, "MM-dd-yy hh:mm aaaa")}
        </div>
      )}

      {appointment && (
        <div>
          <div className="flex items-center  gap-1">
            <Badge className="gap-1 w-fit">
              <CalendarX size={16} /> Appt Set
            </Badge>
            {format(appointment.date, "MM-dd-yy hh:mm aaaa")}
          </div>
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
          {edit ? (
            <GeneralInfoForm info={leadInfo} onChange={onSetInfo} />
          ) : (
            <div className="relative group">
              <div className="flex gap-1">
                <TextGroup
                  title="Dob"
                  value={
                    leadInfo.dateOfBirth
                      ? format(new Date(leadInfo.dateOfBirth), "MM/dd/yy")
                      : ""
                  }
                />
                {leadInfo.dateOfBirth && (
                  <span className="font-semibold">
                    - {getAge(leadInfo.dateOfBirth)} yrs.
                  </span>
                )}
              </div>
              <TextGroup
                title="Height"
                value={leadInfo.height?.toString() || ""}
              />
              <div className="flex gap-1">
                <TextGroup
                  title="Weight"
                  value={leadInfo.weight?.toString() || ""}
                />
                lbs
              </div>
              <p>Smoker: {leadInfo.smoker ? "Yes" : "No"}</p>
              <TextGroup
                title="Income"
                value={leadInfo.income?.toString() || ""}
              />
              <TextGroup title="Gender" value={leadInfo.gender} />
              <TextGroup
                title="Marital Status"
                value={leadInfo.maritalStatus}
              />
              <Button
                className="absolute translate-y-1/2 top-0 right-0 rounded-full lg:opacity-0 group-hover:opacity-100"
                onClick={() => setEdit(true)}
              >
                <FilePenLine size={16} />
              </Button>
            </div>
          )}
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
