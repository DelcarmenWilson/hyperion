"use client";
import { useOnlineUserData } from "@/hooks/user/use-user";
import ChatCard from "./card";
import SkeletonWrapper from "../skeleton-wrapper";
import { ScrollArea } from "../ui/scroll-area";

export const ChatList = () => {
  const { onlineUsers, isFetchingOnlineUsers } = useOnlineUserData();
  return (
    <ScrollArea>
      <SkeletonWrapper isLoading={isFetchingOnlineUsers}>
        {onlineUsers?.map((user) => (
          <ChatCard key={user.id} user={user} />
        ))}
      </SkeletonWrapper>
    </ScrollArea>
  );
};
