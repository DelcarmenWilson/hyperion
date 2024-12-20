"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PhoneOutgoing } from "lucide-react";
import { formatDistance } from "date-fns";
import {
  useConversationData,
  useConversationId,
} from "@/hooks/use-conversation";

import { LeadCommunication } from "@prisma/client";
import { LeadCommunicationType } from "@/types/lead";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { getPhoneStatusText } from "@/formulas/phone";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ConversationsSidebar = () => {
  const { onGetConversations } = useConversationData();
  const { conversations, conversationsFetching } = onGetConversations();
  const { conversationId } = useConversationId();

  return (
    <div className="flex flex-col h-full gap-1 p-1">
      <h4 className="text-lg text-muted-foreground font-semibold">
        Conversations
      </h4>
      <ScrollArea>
        <div className="space-y-2 h-full">
          <SkeletonWrapper isLoading={conversationsFetching} fullHeight>
            {conversations && conversations.length > 0 ? (
              <>
                {conversations.map((conversation) => (
                  <ConversationCard
                    key={conversation.id}
                    id={conversation.id}
                    lastCommunication={conversation.lastCommunication}
                    firstName={conversation.firstName}
                    lastName={conversation.lastName}
                    unread={conversation.unread}
                    lastDate={conversation.updatedAt}
                    active={conversationId == conversation.id}
                  />
                ))}
              </>
            ) : (
              <EmptyCard title="No Conversations" />
            )}
          </SkeletonWrapper>
        </div>
      </ScrollArea>
    </div>
  );
};

type ConversationCardProps = {
  id: string;
  lastCommunication: LeadCommunication | null;
  firstName: string;
  lastName: string;
  unread: number;
  lastDate: Date;
  active: boolean;
};
export const ConversationCard = ({
  id,
  lastCommunication,
  firstName,
  lastName,
  unread,
  lastDate,
  active = false,
}: ConversationCardProps) => {
  const initials = `${firstName.charAt(0)} ${lastName.charAt(0)}`;
  const fullName = `${firstName} ${lastName}`;
  return (
    <Link
      href={`/conversations/${id}`}
      className={cn(
        "relative flex items-center gap-2 border rounded hover:bg-secondary p-2 cursor-pointer w-full",
        active && "bg-primary/25"
      )}
    >
      <div className="relative">
        {unread > 0 && (
          <Badge className="flex-center absolute rounded-full text-xs -top-2 -right-2 z-2 px-2.5 py-0.5">
            {unread}
          </Badge>
        )}

        <Avatar className="rounded-full">
          <AvatarImage className="rounded-full" src={""} />
          <AvatarFallback className="rounded-full bg-primary/50 text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm">{fullName}</p>
          <p className="text-xs text-right">
            {formatDistance(lastDate, new Date(), {
              addSuffix: true,
            }).replace("about", "")}
          </p>
        </div>

        {lastCommunication?.type == LeadCommunicationType.SMS ? (
          <div className="text-sm text-muted-foreground w-full text-ellipsis line-clamp-1">
            <span>{lastCommunication?.content}</span>
          </div>
        ) : (
          <div className="flex gap-2 items-center text-sm text-muted-foreground">
            {lastCommunication?.direction.toLowerCase() === "inbound" ? (
              getPhoneStatusText(lastCommunication?.status as string)
            ) : (
              <>
                <PhoneOutgoing size={16} />
                {lastCommunication?.direction}
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};
