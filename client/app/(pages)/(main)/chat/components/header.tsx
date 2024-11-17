"use client";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useChatActions, useChatData } from "@/hooks/chat/use-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import Hint from "@/components/custom/hint";
import DeleteDialog from "@/components/custom/delete-dialog";

export const Header = () => {
  const currentUser = useCurrentUser();
  const { onChatGet } = useChatData();
  const { onChatDelete, chatDeleting } = useChatActions();
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

        <div className="flex flex-1 items-center gap-2 justify-between group">
          <span className="text-lg">{fullName}</span>

          <div className="opacity-0 group-hover:opacity-100">
            <Hint label="Delete Chat">
              <DeleteDialog
                title="chat"
                cfText="Delete Chat"
                onConfirm={onChatDelete}
                loading={chatDeleting}
              />
            </Hint>
          </div>
        </div>
      </SkeletonWrapper>
    </div>
  );
};
