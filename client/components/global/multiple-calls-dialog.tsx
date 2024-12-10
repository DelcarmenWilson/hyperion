"use client";
import { Phone } from "lucide-react";

import axios from "axios";
import { useLeadCallData } from "@/hooks/lead/use-call";
import { usePhoneStore } from "@/stores/phone-store";
import { useCallStore } from "@/stores/call-store";

import { ShortCall } from "@/types";
import { Button } from "../ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDateTime } from "@/formulas/dates";
import { formatPhoneNumber } from "@/formulas/phones";

const MultipleCallsDialog = () => {
  const { callIds, isMultipleCallDialogOpen, onMultipleCallDialogClose } =
    useCallStore();
  const { onGetMultipleCalls } = useLeadCallData();
  const { calls, callsFetching } = onGetMultipleCalls();
  const callCount = callIds?.length;

  const { onPhoneOutOpen } = usePhoneStore();

  const onCallBack = async (leadId: string) => {
    //TODO THIS IS ALL TEMPORARY UNTIL WE FIND A MORE PERMANENT SOLUTION
    const response = await axios.post("/api/leads/details/by-id", {
      leadId,
    });
    const lead = response.data;
    if (!lead) return;
    onMultipleCallDialogClose();
    onPhoneOutOpen(lead);
  };
  return (
    <Dialog
      open={isMultipleCallDialogOpen}
      onOpenChange={onMultipleCallDialogClose}
    >
      <DialogContent>
        <CustomDialogHeader
          icon={Phone}
          title={`${callCount} missed call${callCount && callCount > 1 && "s"}`}
        />
        <SkeletonWrapper isLoading={callsFetching}>
          {calls?.map((call) => (
            <CallCard
              key={call.id}
              call={call}
              onCallBack={() => onCallBack(call.leadId as string)}
            />
          ))}
        </SkeletonWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default MultipleCallsDialog;

const CallCard = ({
  call,
  onCallBack,
}: {
  call: ShortCall;
  onCallBack: () => void;
}) => {
  return (
    <Card>
      <CardContent className="flex justify-between items-center gap-2 !p-2">
        <div className="text-sm">
          <p>
            {call.lead?.firstName} {call.lead?.lastName}
          </p>

          <div className="flex gap-2 items-center">
            <p className="text-muted-foreground">
              {formatPhoneNumber(call.from)}
            </p>
            <Button variant="outlineprimary" size="xs" onClick={onCallBack}>
              <Phone size={14} />
            </Button>
          </div>
        </div>
        <div className="text-sm">
          <p>{formatDateTime(call.createdAt)}</p>
          <span className="text-muted-foreground">{call.lead?.email}</span>
        </div>
      </CardContent>
    </Card>
  );
};
