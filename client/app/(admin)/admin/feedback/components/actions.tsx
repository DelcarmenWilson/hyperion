"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Copy, Eye, MoreHorizontal, Trash } from "lucide-react";

import { FullFeedback } from "@/types";

import { AlertModal } from "@/components/modals/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { feedbackDeleteById } from "@/actions/feedback";

interface FeedbackActionsProps {
  feedback: FullFeedback;
}
export const FeedbackActions = ({ feedback }: FeedbackActionsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(feedback.id);
    toast.success("Lead id copied to the clipboard");
  };

  const onDelete = async () => {
    setLoading(true);
    feedbackDeleteById(feedback.id).then((data) => {
      if (data.success) {
        toast.success(data.success);
        setAlertOpen(false);
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        height="h-auto"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="gap-2"
            onClick={() => {
              router.push(`/feedback/${feedback.id}`);
            }}
          >
            <Eye size={16} />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2" onClick={onCopy}>
            <Copy size={16} />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => setAlertOpen(true)}
          >
            <Trash size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
