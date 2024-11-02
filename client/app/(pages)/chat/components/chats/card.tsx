"use client";
import React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useChatStore } from "@/hooks/use-chat";

import { ShortChat } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistance } from "date-fns";

const Renderer = dynamic(() => import("@/components/global/message/renderer"), {
  ssr: false,
});

export const ChatCard = ({ chat }: { chat: ShortChat }) => {
  const user = useCurrentUser();
  const { chatId, setChatId } = useChatStore();
  const otherUser = chat.userOneId == user?.id! ? chat.userTwo : chat.userOne;
  const initials = `${otherUser.firstName.charAt(
    0
  )} ${otherUser.lastName.charAt(0)}`;
  const chatDate = chat.lastMessage
    ? chat.lastMessage.createdAt
    : chat.updatedAt;
  return (
    <div
      className={cn(
        "relative flex items-center gap-2 border rounded  p-2 cursor-pointer w-full",
        chatId == chat.id ? "bg-primary/25" : "hover:bg-secondary"
      )}
      onClick={() => setChatId(chat.id)}
    >
      <div className="relative">
        {/* {chat.unread > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-accent rounded-full text-sm p-1">
              {chat.unread}
            </span>
          )} */}

        <Avatar className="rounded-full">
          <AvatarImage
            className="rounded-full"
            src={otherUser.image as string}
          />
          <AvatarFallback className="rounded-full bg-primary/50 text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm">{otherUser.firstName}</p>
          <p className="text-xs text-right">
            {formatDistance(chatDate, new Date(), {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className=" flex flex-col">
          <div className="text-muted-foreground text-sm truncate overflow-hidden">
            {chat.lastMessage?.body ? (
              <Renderer value={chat.lastMessage?.body} />
            ) : (
              <span>new message</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// export const ChatCard = ({ chat }: { chat: ShortChat }) => {
//   const user = useCurrentUser();
//   const { chatId, setChatId } = useChatStore();
//   const otherUser = chat.userOneId == user?.id! ? chat.userTwo : chat.userOne;
//   const initials = `${otherUser.firstName.substring(
//     0,
//     1
//   )} ${otherUser.lastName.substring(0, 1)}`;
//   const fullName = `${otherUser.firstName} ${otherUser.lastName}`;
//   return (
//     <div
//       className={cn(
//         "relative border rounded  p-2 cursor-pointer w-full my-1",
//         chatId == chat.id ? "bg-primary/25" : "hover:bg-secondary"
//       )}
//       onClick={() => setChatId(chat.id)}
//     >
//       <div className="flex justify-between items-center">
//         <div className="relative">
//           {/* {chat.unread > 0 && (
//             <span className="absolute -top-2 -right-2 bg-primary text-accent rounded-full text-sm p-1">
//               {chat.unread}
//             </span>
//           )} */}

//           <Avatar className="rounded-full">
//             <AvatarImage
//               className="rounded-full"
//               src={otherUser.image as string}
//             />
//             <AvatarFallback className="rounded-full bg-primary/50 text-xs">
//               {initials}
//             </AvatarFallback>
//           </Avatar>
//         </div>
//         <div className="text-sm">
//           <p className="text-xs text-right">
//             {formatDistance(chat.updatedAt, new Date(), {
//               addSuffix: true,
//             })}
//           </p>
//           <p className="font-semibold">{fullName}</p>
//         </div>
//       </div>
//       <div className=" flex flex-col">
//         <div className=" text-muted-foreground text-sm truncate overflow-hidden">
//           {chat.lastMessage?.body ? (
//             <Renderer value={chat.lastMessage?.body} />
//           ) : (
//             <span>new message</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
