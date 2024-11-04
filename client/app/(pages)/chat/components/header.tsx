"use client";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useChatData } from "@/hooks/chat/use-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatActions } from "@/components/chat/actions";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const Header = () => {
  const currentUser = useCurrentUser();
  const { onChatGet } = useChatData();
  const { chat, chatIsFetching } = onChatGet();
  if (!chat) return;
  const user =
    chat?.userOneId == currentUser?.id! ? chat?.userTwo : chat?.userOne;
  const initials = `${user.firstName.substring(0, 1)} ${user.lastName.substring(
    0,
    1
  )}`;
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="flex flex-1 justify-between items-center h-14 gap-2 px-2">
      <SkeletonWrapper isLoading={chatIsFetching}>
    
        <Avatar className="rounded-full">
          <AvatarImage className="rounded-full" src={user.image as string} />
          <AvatarFallback className="rounded-full bg-primary/50 text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>


        <div className="flex flex-1 items-center gap-2 justify-between">
          <span className="text-lg">{fullName}</span>
          

        <ChatActions/>

       
         
        </div>
      </SkeletonWrapper>
    </div>
  );
};
