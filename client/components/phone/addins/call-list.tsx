import React from "react";
import { Phone } from "lucide-react";
import { usePhoneStore } from "@/stores/phone-store";
import axios from "axios";

import { ShortCall } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate, formatDateTime, formatTime } from "@/formulas/dates";
import { formatPhoneNumber } from "@/formulas/phones";

const CallsList = ({
  calls,
  loading,
}: {
  calls: ShortCall[];
  loading: boolean;
}) => {
  const { onPhoneOutOpen } = usePhoneStore();

  const onCallBack = async (leadId: string) => {
    //TODO THIS IS ALL TEMPORARY UNTIL WE FIND A MORE PERMANENT SOLUTION
    const response = await axios.post("/api/leads/details/by-id", {
      leadId,
    });
    const lead = response.data;
    if (!lead) return;
    onPhoneOutOpen(lead);
  };
  return (
    <SkeletonWrapper isLoading={loading}>
      <ScrollArea>
        {calls.map((call) => (
          <CallCard
            key={call.id}
            call={call}
            onCallBack={() => onCallBack(call.conversation.lead?.id as string)}
          />
        ))}
      </ScrollArea>
    </SkeletonWrapper>
  );
};

const CallCard = ({
  call,
  onCallBack,
}: {
  call: ShortCall;
  onCallBack: () => void;
}) => {
  return (
    <Card className="mb-2">
      <CardContent className="flex justify-between items-center gap-2 !p-2">
        <div className="text-sm">
          <p>
            {call.conversation.lead?.firstName}{" "}
            {call.conversation.lead?.lastName}
          </p>

          <div className="flex gap-2 items-center">
            <p className="text-muted-foreground">
              {formatPhoneNumber(call.conversation.lead?.cellPhone as string)}
            </p>
            <Button variant="outlineprimary" size="xs" onClick={onCallBack}>
              <Phone size={14} />
            </Button>
          </div>
        </div>
        <div className="text-muted-foreground text-sm text-end">
          <p>{formatDate(call.createdAt)}</p>
          <p>{formatTime(call.createdAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallsList;
