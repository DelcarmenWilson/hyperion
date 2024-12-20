import { MessagesSquare, PhoneOutgoing } from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/user/use-current";
import {
  useConversationActions,
  useConversationData,
} from "@/hooks/use-conversation";

import { ShortConvo } from "@/types";
import { LeadCommunicationType } from "@/types/lead";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import NewEmptyCard from "../reusable/new-empty-card";
import Hint from "../custom/hint";
import { ScrollArea } from "../ui/scroll-area";
import SkeletonWrapper from "@/components//skeleton-wrapper";

import { calculateTime, formatDate } from "@/formulas/dates";
import { getPhoneStatusText } from "@/formulas/phone";
import { formatDistance } from "date-fns";

const NavConversations = () => {
  const user = useCurrentUser();
  const { audioRef, onUpdateUnreadConversation, unreadConversationUpdating } =
    useConversationActions();

  const { onGetUnreadConversation } = useConversationData();
  const { unreadConversations, unreadConversationsFetching } =
    onGetUnreadConversation();

  return (
    <div>
      <audio ref={audioRef} src={`/sounds/${user?.messageNotification}.wav`} />
      <DropdownMenu>
        <Hint label="Conversations">
          <DropdownMenuTrigger asChild>
            <Button className="relative" size="icon" variant="outline">
              <MessagesSquare size={20} />

              {unreadConversations && unreadConversations?.length > 0 && (
                <Badge className="absolute rounded-full text-xs -top-2 -right-2">
                  {unreadConversations.length > 9 ? (
                    <span>9+</span>
                  ) : (
                    <span>{unreadConversations.length}</span>
                  )}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
        </Hint>
        <DropdownMenuContent
          className="w-full lg:w-[300px] overflow-hidden"
          align="center"
        >
          <DropdownMenuLabel className="flex justify-between">
            Lead Conversations
            <Link href="/conversations" className="text-xs underline">
              View All
            </Link>
          </DropdownMenuLabel>
          <SkeletonWrapper isLoading={unreadConversationsFetching}>
            <ScrollArea>
              <div className="max-h-[400px]">
                {!unreadConversations?.length &&
                  !unreadConversationsFetching && (
                    <NewEmptyCard
                      title="No lead conversations"
                      icon={MessagesSquare}
                    />
                  )}

                {unreadConversations && unreadConversations?.length && (
                  <>
                    {unreadConversations?.map((convo) => (
                      <ConversationCard
                        key={convo.id}
                        onUpdate={() => onUpdateUnreadConversation(convo.id)}
                        convo={convo}
                      />
                    ))}
                    <Button
                      disabled={unreadConversationUpdating}
                      className="w-full gap-2 justify-center mt-2"
                      onClick={() => onUpdateUnreadConversation("clear")}
                    >
                      Mark all as Read
                    </Button>
                  </>
                )}
              </div>
            </ScrollArea>
          </SkeletonWrapper>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ConversationCard = ({
  convo,
  onUpdate,
}: {
  convo: ShortConvo;
  onUpdate: () => void;
}) => {
  const { lead, lastCommunication, unread } = convo;
  return (
    <div
      className="flex gap-2 w-full p-2 bg-background hover:bg-primary/25 border-b cursor-pointer"
      onClick={onUpdate}
    >
      <div className="relative flex-center text-accent">
        <Avatar className="rounded-full">
          <AvatarFallback className="rounded-full bg-primary/50 text-sm">
            {lead.firstName.charAt(0)} {lead.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Badge className="flex-center absolute rounded-full text-xs -top-2 -right-2 z-2 px-2.5 py-0.5">
          {unread}
        </Badge>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className=" font-bold ms-2">{lead.firstName}</h4>
          <p className="text-end text-muted-foreground text-sm">
            {formatDistance(convo.updatedAt, new Date(), {
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
            <span>
              {isNaN(lastCommunication?.duration as number)
                ? "0:00"
                : calculateTime(lastCommunication?.duration as number)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default NavConversations;
