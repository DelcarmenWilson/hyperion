import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocketContext from "@/providers/socket";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePathname } from "next/navigation";
import { Bot, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { FullChatMessage, UnreadShortChat } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SkeletonWrapper from "../skeleton-wrapper";

import { formatDate } from "@/formulas/dates";

import { chatUpdateByIdUnread, chatsGetByUserIdUnread } from "@/actions/chat";

export const NavChat = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const user = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: chats, isFetching: chatsIsFectching } = useQuery<
    UnreadShortChat[]
  >({
    queryKey: ["navbarChats"],
    queryFn: () => chatsGetByUserIdUnread(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: chatUpdateByIdUnread,
    onSuccess: (result) => {
      if (result.success?.length) {
        router.push(`/chat/${result.success}`);
      }
      queryClient.invalidateQueries({
        queryKey: ["navbarChats"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onPlay = () => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.play();
  };

  useEffect(() => {
    socket?.on("chat-message-received", (message: FullChatMessage) => {
      if (pathname.startsWith("/chat")) return;
      queryClient.invalidateQueries({
        queryKey: ["navbarChats"],
      });
      onPlay();
      // toast.success(`New message recieved from ${message.sender.firstName} `);
    });
    // eslint-disable-next-line
  }, []);

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
            {chats && chats?.length > 0 && (
              <Badge className="absolute rounded-full text-xs -top-2 -right-2">
                {chats.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <SkeletonWrapper isLoading={chatsIsFectching}>
          <DropdownMenuContent className="w-full lg:w-[300px]" align="start">
            <DropdownMenuLabel>Agent Chat</DropdownMenuLabel>
            {chats?.length ? (
              <>
                {chats?.map((chat) => (
                  <DropdownMenuItem
                    key={chat.id}
                    className="flex gap-2 border-b"
                    disabled={isPending}
                    onClick={() => mutate(chat.id)}
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
                  disabled={isPending}
                  className="gap-2 justify-center"
                  onClick={() => mutate("clear")}
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
