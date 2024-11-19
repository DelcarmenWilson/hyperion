import Link from "next/link";

import { MessagesSquare } from "lucide-react";
import { useCurrentUser } from "@/hooks/user/use-current";
import {
  useConversationActions,
  useConversationData,
} from "@/hooks/use-conversation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import SkeletonWrapper from "@/components//skeleton-wrapper";

import { formatDate } from "@/formulas/dates";

//TODO - see if we can consolidate the UI with nav Chats
export const NavMessages = () => {
  const user = useCurrentUser();
  const { audioRef, onUpdateUnreadConversation, unreadConversationUpdating } =
    useConversationActions();

  const { onGetUnreadConversation } = useConversationData();
  const {
    unreadConversations,
    unreadConversationsFetching,
    unreadConversationsLoading,
  } = onGetUnreadConversation();

  return (
    <div>
      <audio ref={audioRef} src={`/sounds/${user?.messageNotification}.wav`} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative" size="icon" variant="outline">
            <MessagesSquare size={16} />
            {unreadConversations && unreadConversations?.length > 0 && (
              <Badge className="absolute rounded-full text-xs -top-2 -right-2">
                {unreadConversations.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <SkeletonWrapper isLoading={unreadConversationsFetching}>
          <DropdownMenuContent className="w-full lg:w-[300px]" align="center">
            <DropdownMenuLabel>Lead Messages</DropdownMenuLabel>
            {unreadConversations?.length ? (
              <>
                {unreadConversations?.map((chat) => (
                  <DropdownMenuItem
                    key={chat.id}
                    className="flex gap-2 border-b cursor-pointer"
                    disabled={unreadConversationUpdating}
                    onClick={() => onUpdateUnreadConversation(chat.id)}
                  >
                    <div className="relative">
                      <Badge className="absolute rounded-full text-xs -top-2 -right-2 z-2">
                        {chat.unread}
                      </Badge>
                      <div className="flex-center bg-primary text-accent rounded-full p-1 mr-2">
                        <span className="text-lg font-semibold">{`${chat.lead.firstName.substring(
                          0,
                          1
                        )} ${chat.lead.lastName.substring(0, 1)}`}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className=" font-bold ms-2">
                          {chat.lead.firstName}
                        </h4>
                        <p className="text-end text-muted-foreground text-sm">
                          {formatDate(chat.lastMessage?.createdAt)}
                        </p>
                      </div>
                      <p>{chat.lastMessage?.content}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  disabled={unreadConversationUpdating}
                  className="gap-2 justify-center"
                  onClick={() => onUpdateUnreadConversation("clear")}
                >
                  Mark all as Read
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem className="flex flex-col">
                <p className="text-xl text-center w-full">No new Messages</p>
                <div className="text-end w-full text-sm underline">
                  <Link href="/conversations">View All</Link>
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </SkeletonWrapper>
      </DropdownMenu>
    </div>
  );
};
