import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAge } from "@/formulas/dates";
import { FullLead, FullLeadNoConvo, LeadGeneralInfo } from "@/types";
import { Appointment, Call } from "@prisma/client";
import { format } from "date-fns";
import { Cake, CalendarX, FilePenLine, Plus, XCircle } from "lucide-react";
import { useState } from "react";
import { GeneralInfoForm } from "./forms/general-info-form";

type GeneralInfoClientProps = {
  lead: FullLead | FullLeadNoConvo;
  call?: Call;
  appointment?: Appointment;
  dob?: Date;
  showInfo?: boolean;
};
export const GeneralInfoClient = ({
  lead,
  call,
  appointment,
  dob,
  showInfo = false,
}: GeneralInfoClientProps) => {
  const [edit, setEdit] = useState(false);
  const leadInfo: LeadGeneralInfo = {
    id: lead.id,
    gender: lead.gender,
    maritalStatus: lead.maritalStatus,
    dateOfBirth: lead.dateOfBirth?.toLocaleDateString(),
    weight: lead.weight || undefined,
    height: lead.height || undefined,
    income: lead.income || undefined,
    smoker: lead.smoker,
  };
  const [info, setInfo] = useState(leadInfo);

  const onSetInfo = (e?: LeadGeneralInfo) => {
    if (e) {
      setInfo(e);
    }
    setEdit(false);
  };
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
          {edit ? (
            <GeneralInfoForm lead={info} onChange={onSetInfo} />
          ) : (
            <div className="relative group">
              <p>
                Dob:{" "}
                {leadInfo.dateOfBirth &&
                  format(leadInfo.dateOfBirth, "MM/dd/yy")}
                {leadInfo.dateOfBirth ? (
                  <span className="font-semibold">
                    {" "}
                    - {getAge(leadInfo.dateOfBirth)} yrs.
                  </span>
                ) : (
                  <span className="text-destructive">Not set</span>
                )}
              </p>
              <Box title="Height" value={leadInfo.height!} />
              <p>
                Weight:
                {lead.weight ? (
                  <span>{lead.weight} lbs</span>
                ) : (
                  <span className="text-destructive">Not set</span>
                )}{" "}
              </p>
              <p>Smoker: {leadInfo.smoker ? "Yes" : "No"}</p>
              <Box
                title="Income"
                value={leadInfo.income ? leadInfo.income.toString() : ""}
              />
              <Box title="Gender" value={leadInfo.gender} />
              <Box title="Marital Status" value={leadInfo.maritalStatus} />
              <Button
                className="absolute translate-y-1/2 top-0 right-0 rounded-full opacity-0 group-hover:opacity-100"
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
