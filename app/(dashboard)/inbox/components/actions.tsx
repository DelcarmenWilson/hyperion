"use client";
import { ChevronDown, CircleSlash, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { conversationDeleteById } from "@/actions/conversation";
import { toast } from "sonner";
interface ActionsProps {
  id: string;
}
export const Actions = ({ id }: ActionsProps) => {
  const onDelete = async () => {
    await conversationDeleteById(id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button size="icon" className="rounded-full">
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start">
          <DropdownMenuLabel className="flex flex-col">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer gap-2" onClick={onDelete}>
            <Trash size={16} />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2">
            <CircleSlash size={16} /> Block
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
