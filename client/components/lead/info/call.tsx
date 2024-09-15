"use client";
import { Phone } from "lucide-react";
import { usePhone } from "@/hooks/use-phone";

import { useLeadCallInfoActions } from "@/hooks/lead/use-lead";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyData } from "./empty-data";
import { LeadStatusSelect } from "@/components/lead/select/lead-status-select";
import { LeadTypeSelect } from "@/components/lead/select/type-select";
import { SectionWrapper } from "./section-wrapper";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type Props = {
  showBtnCall?: boolean;
};

export const CallInfo = ({ showBtnCall = true }: Props) => {
  const { onPhoneOutOpen, onLeadInfoToggle } = usePhone();
  const { callInfo, isFetchingCallInfo } = useLeadCallInfoActions();

  const callCount = callInfo?.calls?.filter(
    (e) => e.direction == "outbound"
  ).length;

  return (
    <SkeletonWrapper isLoading={isFetchingCallInfo}>
      {/* <p className="text-sm">Local time : 11:31 am</p> */}
      {/* <p className="text-sm">Local time : {getLocalTime("TX")}</p> */}
      {callInfo ? (
        <SectionWrapper title="Call">
          <div className="flex flex-col">
            {showBtnCall && (
              <div className="relative w-fit ">
                <Button
                  className="gap-2"
                  disabled={callInfo.status == "Do_Not_Call"}
                  onClick={() => {
                    onLeadInfoToggle();
                    onPhoneOutOpen();
                  }}
                  size="sm"
                >
                  <Phone size={16} />
                  CLICK TO CALL
                </Button>

                {callCount! > 0 && (
                  <Badge className="absolute -right-6 rounded-full text-xs">
                    {callCount}
                  </Badge>
                )}
              </div>
            )}
            <div className="text-sm">
              <div className="py-1">
                <p>Type</p>
                <LeadTypeSelect id={callInfo.id} type={callInfo.type} />
              </div>

              <div className="py-1">
                <p>Status</p>
                <LeadStatusSelect id={callInfo.id} status={callInfo.status} />
              </div>
            </div>
          </div>
        </SectionWrapper>
      ) : (
        <EmptyData />
      )}
    </SkeletonWrapper>
  );
};
