"use client";
import { Phone } from "lucide-react";
import { usePhoneStore } from "@/stores/phone-store";
import { useLeadCallInfoActions } from "@/hooks/lead/use-lead";

import { LeadDefaultStatus } from "@/types/lead";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyData } from "./empty-data";
import { LeadStatusSelect } from "@/components/lead/select/lead-status-select";
import { LeadTypeSelect } from "@/components/lead/select/type-select";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Input } from "@/components/ui/input";

type Props = {
  leadId: string;
  showBtnCall?: boolean;
};

export const CallInfo = ({ leadId, showBtnCall = true }: Props) => {
  const { onPhoneOutOpen, onLeadInfoToggle } = usePhoneStore();
  const { onGetLeadCallInfo } = useLeadCallInfoActions(leadId);
  const { callInfo, callInfoFetching } = onGetLeadCallInfo();

  const callCount = callInfo?.conversations.reduce(
    (sum, c) => sum + c.communications.length,
    0
  );

  return (
    <SkeletonWrapper isLoading={callInfoFetching}>
      {/* <p className="text-sm">Local time : 11:31 am</p> */}
      {/* <p className="text-sm">Local time : {getLocalTime("TX")}</p> */}
      {callInfo ? (
        <div className="border rounded-sm shadow-md p-2">
          <div className="flex justify-between items-center pb-1">
            <h4 className="text-muted-foreground">Call</h4>
            {showBtnCall ? (
              <div className="relative w-fit ">
                <Button
                  className="gap-2"
                  size="sm"
                  variant="gradientDark"
                  disabled={callInfo.statusId == LeadDefaultStatus.DONOTCALL}
                  onClick={() => {
                    onLeadInfoToggle();
                    onPhoneOutOpen();
                  }}
                >
                  <Phone size={16} />
                  CLICK TO CALL
                </Button>

                {callCount! > 0 && (
                  <Badge
                    variant="gradientDark"
                    className="absolute -left-6 rounded-full text-xs"
                  >
                    {callCount}
                  </Badge>
                )}
              </div>
            ) : (
              <Badge variant="gradientDark" className="rounded-full text-xs">
                {callCount}
              </Badge>
            )}
          </div>
          <div className="flex flex-col">
            <div className="text-sm">
              <div className="py-1">
                <p className="text-sm">Type</p>
                <LeadTypeSelect id={callInfo.id} type={callInfo.type} />
              </div>

              <div className="py-1">
                <p className="text-sm">Status</p>
                <LeadStatusSelect
                  id={callInfo.id}
                  statusId={callInfo.statusId}
                />
              </div>
              <div className="py-1">
                <p className="text-sm">Vendor</p>
                <Input value={callInfo.vendor.replace("_", " ")} disabled />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyData />
      )}
    </SkeletonWrapper>
  );
};
