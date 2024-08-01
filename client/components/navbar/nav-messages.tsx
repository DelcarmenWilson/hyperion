import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SocketContext from "@/providers/socket";
import Link from "next/link";

import { useCurrentUser } from "@/hooks/use-current-user";
import { MessagesSquare } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SkeletonWrapper from "@/components//skeleton-wrapper";

import { formatDate } from "@/formulas/dates";

import { ShortConvo } from "@/types";

import {
  conversationsGetByUserIdUnread,
  conversationUpdateByIdUnread,
} from "@/actions/conversation";

//TODO - see if we can consolidate the UI with nav Chats
export const NavMessages = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const { socket } = useContext(SocketContext).SocketState;
  const queryClient = useQueryClient();

  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: conversations, isFetching: chatsIsFectching } = useQuery<
    ShortConvo[]
  >({
    queryKey: ["navbarMessages"],
    queryFn: () => conversationsGetByUserIdUnread(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: conversationUpdateByIdUnread,
    onSuccess: (result) => {
      if (result.success?.length) {
        router.push(`/conversations/${result.success}`);
      }
      queryClient.invalidateQueries({
        queryKey: ["navbarMessages"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onPlay = () => {
    queryClient.invalidateQueries({
      queryKey: ["navbarMessages"],
    });
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.play();
  };

  useEffect(() => {
    socket?.on("conversation-message-notify", onPlay);
    return () => {
      socket?.off("conversation-message-notify", onPlay);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <audio ref={audioRef} src={`/sounds/${user?.messageNotification}.wav`} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative" size="icon" variant="outline">
            <MessagesSquare size={16} />
            {conversations && conversations?.length > 0 && (
              <Badge className="absolute rounded-full text-xs -top-2 -right-2">
                {conversations.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <SkeletonWrapper isLoading={chatsIsFectching}>
          <DropdownMenuContent className="w-full lg:w-[300px]" align="start">
            <DropdownMenuLabel>Lead Messages</DropdownMenuLabel>
            {conversations?.length ? (
              <>
                {conversations?.map((chat) => (
                  <DropdownMenuItem
                    key={chat.id}
                    className="flex gap-2 border-b cursor-pointer"
                    disabled={isPending}
                    onClick={() => mutate(chat.id)}
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
