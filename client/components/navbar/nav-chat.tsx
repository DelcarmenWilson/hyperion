import { useRef } from "react";
import Link from "next/link";
import { Bot, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useChatActions, useChatData } from "@/hooks/use-chat";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import SkeletonWrapper from "../skeleton-wrapper";
import { formatDate } from "@/formulas/dates";

export const NavChat = () => {
  const user = useCurrentUser();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { navChats, navChatsIsFectching } = useChatData("empty");
  const onPlay = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.play();
  };
  const { navMutate, navIsPending } = useChatActions("empty", onPlay);

  return (
    <div>
      <audio
        ref={audioRef}
        src={`/sounds/${user?.messageInternalNotification}.wav`}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative" size="icon" variant="outline">
            <Bot size={16} />
            {navChats && navChats?.length > 0 && (
              <Badge className="absolute rounded-full text-xs -top-2 -right-2">
                {navChats.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <SkeletonWrapper isLoading={navChatsIsFectching}>
          <DropdownMenuContent className="w-full lg:w-[300px]" align="start">
            <DropdownMenuLabel>Agent Chat</DropdownMenuLabel>
            {navChats?.length ? (
              <>
                {navChats?.map((chat) => (
                  <DropdownMenuItem
                    key={chat.id}
                    className="flex gap-2 border-b"
                    disabled={navIsPending}
                    onClick={() => navMutate(chat.id)}
                  >
                    <div className="relative">
                      <Badge className="absolute rounded-full text-xs -top-2 -right-2 z-2">
                        {chat.unread}
                      </Badge>
                      <Avatar>
                        <AvatarImage
                          src={chat.lastMessage?.sender.image || ""}
                          loading="lazy"
                        />
                        <AvatarFallback className="bg-primary dark:bg-accent">
                          <User className="text-accent dark:text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className=" font-bold ms-2">
                          {chat.lastMessage?.sender.firstName}
                        </h4>
                        <p className="text-end text-muted-foreground text-sm">
                          {formatDate(chat.lastMessage?.createdAt)}
                        </p>{" "}
                      </div>
                      <p>{chat.lastMessage?.content}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  disabled={navIsPending}
                  className="gap-2 justify-center"
                  onClick={() => navMutate("clear")}
                >
                  Mark all as Read
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem className="flex flex-col">
                <p className="text-xl text-center w-full">No new Messages</p>
                <div className="text-end w-full text-sm underline">
                  <Link href="/chat">View All</Link>
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </SkeletonWrapper>
      </DropdownMenu>
    </div>
  );
};
