"use client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Feedback } from "@prisma/client";

type FeedbackCardProps = {
  feedback: Feedback;
};

export const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/feedback/${feedback.id}`)}
      variant="ghost"
      className="flex flex-col items-start gap-1 h-[100px] text-xs overflow-hidden border p-2"
    >
      <p className="flex justify-between items-center w-full text-muted-foreground">
        <span>{feedback.status}</span>
        <span className="text-right">
          {format(feedback.createdAt, "MM-dd-yy")}
        </span>
      </p>
      <span>{feedback.page}</span>
      <p className="text-center text-sm font-semibold w-full overflow-hidden text-ellipsis">
        {feedback.headLine}
      </p>
      <p className="text-center text-sm font-meduim w-full overflow-hidden text-ellipsis">
        {feedback.feedback}
      </p>
    </Button>
  );
};
