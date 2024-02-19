"use client";
import { useRouter } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Feedback } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeedbackForm } from "./shared/feedback-form";
import { PageLayout } from "@/components/custom/page-layout";

type FeedbacksClientProps = {
  feedbacks: Feedback[];
};

export const FeedbacksClient = ({ feedbacks }: FeedbacksClientProps) => {
  return (
    <PageLayout title="Feddback" icon={MessageSquarePlus}>
      <div className="flex-1 grid grid-cols-2 space-y-0 pb-2 overflow-hidden">
        <div className="border-e">
          <FeedbackForm feedback={null} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="ml-1 text-sm font-semibold">Your Feedbacks</h3>
          <ScrollArea>
            {feedbacks.length ? (
              <div className="grid grid-cols-3 gap-2 p-2">
                {feedbacks.map((feedback) => (
                  <FeedbackBox key={feedback.id} feedback={feedback} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>You have not leave any feeback!</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </PageLayout>
  );
};

type FeedbackBoxProps = {
  feedback: Feedback;
};

const FeedbackBox = ({ feedback }: FeedbackBoxProps) => {
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
