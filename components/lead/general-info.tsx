import { useEffect, useState } from "react";
import { Cake, CalendarX, FilePenLine, Phone, XCircle } from "lucide-react";
import { format } from "date-fns";

import { emitter } from "@/lib/event-emmiter";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextGroup } from "@/components/reusable/input-group";
import { GeneralInfoForm } from "./forms/general-info-form";

import { LeadGeneralInfo } from "@/types";
import { Appointment, Call } from "@prisma/client";

import { getAge } from "@/formulas/dates";

type GeneralInfoClientProps = {
  leadName: string;
  info: LeadGeneralInfo;
  call?: Call;
  appointment?: Appointment;
  dob?: Date;
  showInfo?: boolean;
};

export const GeneralInfoClient = ({
  leadName,
  info,
  call,
  appointment,
  dob,
  showInfo = false,
}: GeneralInfoClientProps) => {
  const [generalInfo, setGeneralInfo] = useState<LeadGeneralInfo>(info);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onSetInfo = (e: LeadGeneralInfo) => {
    if (e.id == info.id) setGeneralInfo(e);
  };

  useEffect(() => {
    setGeneralInfo(info);
    emitter.on("generalInfoUpdated", (info) => onSetInfo(info));
  }, [info]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
          <h4 className="text-2xl font-semibold py-2">
            General Info - <span className="text-primary">{leadName}</span>
          </h4>
          <GeneralInfoForm
            info={generalInfo}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
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
            <Cake size={16} />
            <XCircle size={16} />
            Birthday: {format(dob!, "MM/dd/yy")}
          </div>
        )}

        {showInfo && (
          <div>
            <div className="relative group">
              <div className="flex gap-1">
                <TextGroup
                  title="Dob"
                  value={
                    generalInfo.dateOfBirth
                      ? format(new Date(generalInfo.dateOfBirth), "MM/dd/yy")
                      : ""
                  }
                />
                {generalInfo.dateOfBirth && (
                  <span className="font-semibold">
                    - {getAge(generalInfo.dateOfBirth)} yrs.
                  </span>
                )}
              </div>
              <TextGroup
                title="Height"
                value={generalInfo.height?.toString() || ""}
              />
              <div className="flex gap-1">
                <TextGroup
                  title="Weight"
                  value={generalInfo.weight?.toString() || ""}
                />
                lbs
              </div>
              <p>Smoker: {generalInfo.smoker ? "Yes" : "No"}</p>
              <TextGroup
                title="Income"
                value={generalInfo.income?.toString() || ""}
              />
              <TextGroup title="Gender" value={generalInfo.gender} />
              <TextGroup
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
