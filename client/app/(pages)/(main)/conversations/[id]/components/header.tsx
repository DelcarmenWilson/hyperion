"use client";
import { useEffect } from "react";
import { Phone } from "lucide-react";

import {
  useConversationData,
  useConversationStore,
} from "@/hooks/use-conversation";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { usePhoneStore } from "@/hooks/use-phone";

import { LeadDefaultStatus } from "@/types/lead";

import { Button } from "@/components/ui/button";
import { EmptyData } from "@/components/lead/info/empty-data";
import { LeadDropDown } from "@/components/lead/dropdown";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatPhoneNumber } from "@/formulas/phones";

export const Header = () => {
  const { onPhoneOutOpen } = usePhoneStore();
  const { isLeadInfoOpen, onLeadInfoToggle } = useConversationStore();
  const { onGetConversation } = useConversationData();
  const { conversation, conversationFetching } = onGetConversation();

  const { setLeadId, setConversationId } = useLeadStore();

  useEffect(() => {
    if (!conversation) return;
    setLeadId(conversation.leadId);
    setConversationId(conversation.id);
  }, [conversation]);

  const lead = conversation?.lead;

  const initials = `${lead?.firstName.substring(
    0,
    1
  )} ${lead?.lastName.substring(0, 1)}`;
  const fullName = `${lead?.firstName} ${lead?.lastName}`;

  return (
    <div className="h-14 p-2 flex-1">
      <SkeletonWrapper isLoading={conversationFetching}>
        {lead ? (
          <div className="flex flex-1 justify-between items-center">
            <div className="flex justify-center items-center bg-primary text-accent rounded-full p-1 mr-2">
              <span className="text-lg font-semibold">{initials}</span>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <span className="text-lg">
                {fullName} {formatPhoneNumber(lead.cellPhone)}
              </span>
              <Button
                disabled={lead.statusId == LeadDefaultStatus.DONOTCALL}
                className="rounded-full"
                variant="outlineprimary"
                size="icon"
                onClick={() => onPhoneOutOpen()}
              >
                <Phone size={16} />
              </Button>

              <LeadDropDown lead={lead} conversationId={conversation.id} />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isLeadInfoOpen ? "default" : "outlineprimary"}
                size="sm"
                onClick={onLeadInfoToggle}
              >
                LEAD INFO
              </Button>
            </div>
          </div>
        ) : (
          <EmptyData height="h-full" />
        )}
      </SkeletonWrapper>
    </div>
  );
};
