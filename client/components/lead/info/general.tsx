import { CalendarX, Phone } from "lucide-react";
import { useLeadStore } from "@/stores/lead-store";
import { useLeadInfoData } from "@/hooks/lead/use-lead";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { EmptyData } from "./empty-data";
import { InputGroup } from "@/components/reusable/input-group";
import { SectionWrapper } from "./section-wrapper";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDateTime, formatDob, getAge } from "@/formulas/dates";

type Props = {
  leadId: string;
  size?: string;
  showInfo?: boolean;
  showEdit?: boolean;
};

export const GeneralInfoClient = ({
  leadId,
  size = "full",
  showInfo = false,
  showEdit = true,
}: Props) => {
  const { onGeneralFormOpen } = useLeadStore();
  const { onGetLeadGeneralInfo } = useLeadInfoData(leadId);
  const { generalInfo, generalInfoFetching } = onGetLeadGeneralInfo();

  const lastCall = generalInfo?.conversations[0];
  const nextAppointment = generalInfo?.appointments[0];

  return (
    <SkeletonWrapper isLoading={generalInfoFetching}>
      {generalInfo ? (
        <SectionWrapper
          title="General"
          onClick={() => showEdit && onGeneralFormOpen(generalInfo.id)}
        >
          <div className="flex flex-col gap-2 text-sm">
            {lastCall && (
              <div
                className={cn(
                  "flex items-center gap-1",
                  !showInfo || (size == "sm" && "flex-col items-start")
                )}
              >
                <Badge className="gap-1 w-fit">
                  <Phone size={16} /> Last Call
                </Badge>
                <p className={cn("text-xs w-full", size == "sm" && "text-end")}>
                  {formatDateTime(lastCall.createdAt)}
                </p>
              </div>
            )}

            {nextAppointment && (
              <div
                className={cn(
                  "flex items-center gap-1",
                  !showInfo || (size == "sm" && "flex-col items-start")
                )}
              >
                <Badge className="gap-1 w-fit">
                  <CalendarX size={16} /> Appt Set
                </Badge>
                <p className={cn("text-xs w-full", size == "sm" && "text-end")}>
                  {formatDateTime(nextAppointment.startDate)}
                </p>
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
                  {/* {showEdit && (
                    <Button
                      className="absolute translate-y-1/2 top-0 right-0 rounded-full lg:opacity-0 group-hover:opacity-100"
                      onClick={() => onGeneralFormOpen(generalInfo.id)}
                    >
                      <FilePenLine size={16} />
                    </Button>
                  )} */}
                </div>
              </div>
            )}
          </div>
        </SectionWrapper>
      ) : (
        <EmptyData />
      )}
    </SkeletonWrapper>
  );
};
