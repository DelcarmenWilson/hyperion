import { useEffect, useState } from "react";
import { CalendarX, FilePenLine, Phone } from "lucide-react";
import { userEmitter } from "@/lib/event-emmiter";
import { useLeadStore, useLeadGeneralInfoActions } from "@/hooks/lead/use-lead";
import { cn } from "@/lib/utils";

import { Appointment } from "@prisma/client";
import { LeadGeneralSchemaType } from "@/schemas/lead";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/reusable/input-group";

import { formatDateTime, formatDob, getAge } from "@/formulas/dates";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type Props = {
  showInfo?: boolean;
  showEdit?: boolean;
};

export const GeneralInfoClient = ({
  showInfo = false,
  showEdit = true,
}: Props) => {
  const { onGeneralFormOpen } = useLeadStore();
  const { generalInfo, isFetchingGeneralInfo } = useLeadGeneralInfoActions();

  if (!generalInfo) return null;

  const lastCall = generalInfo.calls[0];
  const nextAppointment = generalInfo.appointments[0];

  return (
    <div className="flex flex-col gap-2 text-sm">
      <SkeletonWrapper isLoading={isFetchingGeneralInfo}>
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
            {formatDateTime(lastCall.createdAt)}
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
            {formatDateTime(nextAppointment.startDate)}
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
      </SkeletonWrapper>
    </div>
  );
};
