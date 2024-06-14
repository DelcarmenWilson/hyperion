"use client";
import { Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";

import { Feedback } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/formulas/dates";

export const FeedbackCard = ({ feedback }: { feedback: Feedback }) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/feedback/${feedback.id}`)}
      variant="ghost"
      className="flex flex-col items-start gap-1 h-[100px] text-xs overflow-hidden border p-2"
    >
      <p className="flex justify-between items-center w-full text-muted-foreground">
        <span>{feedback.status}</span>
        <span className="text-right">{formatDate(feedback.createdAt)}</span>
      </p>
      <div className="flex justify-between items-center w-full">
        <span>{feedback.page}</span>
        {feedback.images && <Paperclip size={16} />}
      </div>
      <p className="text-center text-sm font-semibold w-full overflow-hidden text-ellipsis">
        {feedback.headLine}
      </p>
      <p className="text-center text-sm font-meduim w-full overflow-hidden text-ellipsis">
        {feedback.feedback}
      </p>
    </Button>
  );
};
