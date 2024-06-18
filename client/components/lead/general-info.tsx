import { useEffect, useState } from "react";
import { Cake, CalendarX, FilePenLine, Phone, XCircle } from "lucide-react";

import { userEmitter } from "@/lib/event-emmiter";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/reusable/input-group";
import { GeneralInfoForm } from "./forms/general-info-form";

import { Appointment } from "@prisma/client";

import { formatDateTime, formatDob, getAge } from "@/formulas/dates";
import { LeadGeneralSchemaType } from "@/schemas/lead";

type GeneralInfoClientProps = {
  info: LeadGeneralSchemaType;
  showInfo?: boolean;
};

export const GeneralInfoClient = ({
  info,
  showInfo = false,
}: GeneralInfoClientProps) => {
  const [generalInfo, setGeneralInfo] = useState<LeadGeneralSchemaType>(info);
  const [dialogOpen, setDialogOpen] = useState(false);

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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
          <h4 className="text-2xl font-semibold py-2">
            General Info -{" "}
            <span className="text-primary">{generalInfo.leadName}</span>
          </h4>
          <GeneralInfoForm
            info={generalInfo}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-2 text-sm">
        {generalInfo.lastCall && (
          <div className="flex items-center  gap-1">
            <Badge className="gap-1 w-fit">
              <Phone size={16} /> Last Call
            </Badge>
            {formatDateTime(generalInfo.lastCall)}
          </div>
        )}

        {generalInfo.nextAppointment && (
          <div>
            <div className="flex items-center  gap-1">
              <Badge className="gap-1 w-fit">
                <CalendarX size={16} /> Appt Set
              </Badge>
              {formatDateTime(generalInfo.nextAppointment)}
            </div>
          </div>
        )}

        {generalInfo.dob && (
          <div className="flex items-center gap-1 w-fit">
            <Cake size={16} />
            <XCircle size={16} />
            Birthday: {formatDob(generalInfo.dob)}
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
              <Button
                className="absolute translate-y-1/2 top-0 right-0 rounded-full lg:opacity-0 group-hover:opacity-100"
                onClick={() => setDialogOpen(true)}
              >
                <FilePenLine size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
