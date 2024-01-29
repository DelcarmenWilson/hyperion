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
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start">
          <DropdownMenuLabel className="flex flex-col">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={onDelete}>
            <Trash className="h-4 w-4 mr-2" /> Delete
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CircleSlash className="h-4 w-4 mr-2" /> Block
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <Button size="icon" className="rounded-full">
        <ChevronDown className="h-4 w-4" />
      </Button>

      <Button variant="destructive" size="icon" onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>

      <Button variant="secondary" size="icon">
        <CircleSlash className="h-4 w-4" />
      </Button> */}
    </div>
  );
};
