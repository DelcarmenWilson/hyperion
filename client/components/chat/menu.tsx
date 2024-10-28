import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/hooks/use-chat";
export const ChatMenu = () => {
  const { onGroupDialogOpen } = useChatStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onGroupDialogOpen}>
          Group Message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
