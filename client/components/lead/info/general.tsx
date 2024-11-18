import { CalendarX, Phone } from "lucide-react";
import { useLeadStore, useLeadGeneralInfoActions } from "@/hooks/lead/use-lead";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { EmptyData } from "./empty-data";
import { InputGroup } from "@/components/reusable/input-group";
import { SectionWrapper } from "./section-wrapper";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDateTime, formatDob, getAge } from "@/formulas/dates";

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

  const lastCall = generalInfo?.calls[0];
  const nextAppointment = generalInfo?.appointments[0];
  // console.log(formatDob(generalInfo?.dateOfBirth))

  return (
    <SkeletonWrapper isLoading={isFetchingGeneralInfo}>
      {generalInfo ? (
        <SectionWrapper
          title="General"
          onClick={() => showEdit && onGeneralFormOpen(generalInfo.id)}
        >
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
                <span className="text-xs">
                  {formatDateTime(lastCall.createdAt)}
                </span>
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
                <span className="text-xs">
                  {formatDateTime(nextAppointment.startDate)}
                </span>
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
