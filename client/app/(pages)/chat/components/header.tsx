"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useChatStore, useChatData } from "@/hooks/use-chat";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const Header = () => {
  const currentUser = useCurrentUser();
  const { chatId } = useChatStore();
  const { chat, chatIsFetching } = useChatData(chatId!);
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
        {/* <div className="flex justify-center items-center bg-primary text-accent rounded-full p-1 mr-2">
        <span className="text-lg font-semibold">{initials}</span>
      </div> */}
        <div className="flex-center  h-10 w-10 text-lg font-bold bg-primary text-accent rounded-full">
          {initials}
        </div>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-lg">{fullName}</span>
          {/* <Button
          disabled={lead.status == "Do_Not_Call"}
          className="rounded-full"
          variant="outlineprimary"
          size="icon"
          onClick={() => usePm.onPhoneOutOpen(lead)}
        >
          <Phone size={16} />
        </Button> */}

          {/* <LeadDropDown lead={lead} /> */}
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
          variant={isOpen ? "default" : "outlineprimary"}
          size="sm"
          onClick={() =>
            setIsOpen((open) => {
              userEmitter.emit("toggleLeadInfo", !open);
              return !open;
            })
          }
        >
          LEAD INFO
        </Button> */}
        </div>
      </SkeletonWrapper>
    </div>
  );
};
