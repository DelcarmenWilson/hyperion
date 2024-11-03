import { useContext } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Clock,
  Cog,
  Lock,
  MoreVertical,
  Phone,
  User,
  UserIcon,
} from "lucide-react";

import SocketContext from "@/providers/socket";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "@/hooks/user/use-current";
import { useChatStore } from "@/hooks/chat/use-chat";
import { useLoginStatus } from "@/hooks/use-login-status";

import { OnlineUser } from "@/types/user";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatSecondsToTime } from "@/formulas/numbers";

import { chatInsert, chatUpdateByIdUnread } from "@/actions/chat";
import { adminSuspendAccount } from "@/actions/admin/user";

import { ALLADMINS, UPPERADMINS } from "@/constants/user";

const ChatCard = ({ user }: { user: OnlineUser }) => {
  const router = useRouter();
  const role = useCurrentRole();

  const { socket } = useContext(SocketContext).SocketState;
  const { onChatInfoOpen, user: agent, onChatClose } = useChatStore();
  const { onLoginStatusOpen } = useLoginStatus();
  //TODO - need to add this to the hooks
  const onChatClick = async () => {
    let chatId = user.chatId;
    if (!chatId) {
      const chat = await chatInsert(user.id);
      chatId = chat.success?.id;
    }
    chatUpdateByIdUnread(chatId!);
    onChatInfoOpen(user, chatId);
  };
  const onAccountSupended = async () => {
    const results = await adminSuspendAccount(user.id);
    if (results.success) {
      socket?.emit("account-suspended-sent", user.id);
      toast.success(results.success);
    } else toast.error(results.error);
  };
  const isAdmin = ALLADMINS.includes(role!);
  return (
    <div
      className={cn(
        "group relative border border-[#ccc] rounded  p-2 cursor-pointer w-full my-1",
        agent?.id == user.id ? "bg-primary/25" : "hover:bg-secondary"
      )}
    >
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0"
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => {
                onChatClose();
                router.push(`/users/${user.id}`);
              }}
            >
              <User size={16} />
              Profile
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              className="cursor-pointer gap-2"
              asChild
            >
              <Link
                className="flex gap-2 items-center"
                href={`/users/${user.id}`}
              >
                <User size={16} />
                Profile
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => onLoginStatusOpen(user)}
            >
              <Cog size={16} /> Logins
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {UPPERADMINS.includes(role!) && (
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={onAccountSupended}
              >
                <Lock size={16} /> Lock Account
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div onClick={onChatClick}>
        <div className="flex items-center">
          <div className="relative">
            {user.unread > 0 && (
              <Badge
                variant="gradientDark"
                className="absolute -top-2 -left-2 rounded-full text-xs z-10"
              >
                {user.unread}
              </Badge>
            )}

            <Badge
              className="p-1 absolute bottom-0 right-0 z-10"
              variant={user.online ? "success" : "destructive"}
            ></Badge>
            <Avatar>
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="bg-primary dark:bg-accent">
                <UserIcon className="text-accent dark:text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 px-2 text-center">
            <p className="text-lg font-bold capitalize">{user.userName}</p>
            <p className="text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </p>
            {/* <p>{user.lastMessage}</p> */}
          </div>
        </div>
        {isAdmin && (
          <div className="flex justify-between items-center gap-2 opacity-0 group-hover:opacity-100">
            <span className=" lowercase text-sm font-semibold">
              {user.role.replace("_", " ")}
            </span>
            <div className="flex justify-end items-center gap-2">
              <div className="flex justify-center items-center gap-2">
                <Phone size={14} />
                <p className="text-muted-foreground text-xs font-bold">
                  {user.calls}
                </p>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Clock size={14} />
                <p className="text-muted-foreground text-xs font-bold">
                  {formatSecondsToTime(user.duration)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatCard;
