"use client";
import { Button } from "@/components/ui/button";
import { conversationDeleteById } from "@/data/actions/conversation";
import { ChevronDown, CircleSlash, Trash } from "lucide-react";
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
      <Button size="icon" className="rounded-full">
        <ChevronDown className="h-4 w-4" />
      </Button>

      <Button variant="destructive" size="icon" onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>

      <Button variant="secondary" size="icon">
        <CircleSlash className="h-4 w-4" />
      </Button>
    </div>
  );
};
