"use client";
import { useOnlineUserData } from "@/hooks/user/use-user";
import ChatCard from "./card";
import SkeletonWrapper from "../skeleton-wrapper";

export const ChatList = () => {
  const { onlineUsers, isFetchingOnlineUsers } = useOnlineUserData();
  return (
    <div className="h-full overflow-y-auto pe-2">
      <SkeletonWrapper isLoading={isFetchingOnlineUsers}>
        {onlineUsers?.map((user) => (
          <ChatCard key={user.id} user={user} />
        ))}
      </SkeletonWrapper>
    </div>
  );
};
