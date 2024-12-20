import React from "react";
import { ChevronDown } from "lucide-react";
import { useCurrentRole } from "@/hooks/user/use-current";
import { useChatStore } from "@/stores/chat-store";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { ALLADMINS } from "@/constants/user";

const ChatMenu = () => {
  const role = useCurrentRole();
  const { onGroupDialogOpen } = useChatStore();
  if (!ALLADMINS.includes(role!)) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem onClick={onGroupDialogOpen}>
          Group Message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatMenu;
