"use client";
import { MessageSquarePlus } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { Feedback, User } from "@prisma/client";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeedbackForm } from "../../components/shared/feedback-form";

type FeedBackIdClientProps = {
  feedback: Feedback & {
    user: User;
  };
};
export const FeedBackIdClient = ({ feedback }: FeedBackIdClientProps) => {
  return (
    <Card className="flex flex-col relative overflow-hidden w-full min-h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            Feedback - {`${feedback.page} | ${feedback.headLine}`}
          </CardTitle>
        </div>
      </div>

      <CardContent className="flex-1 grid grid-cols-2 space-y-0 pb-2 overflow-hidden">
        <div className="border-e">
          <FeedbackForm feedback={feedback} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="ml-1 text-sm font-semibold">Your Feedbacks</h3>
          <p>status: {feedback.status}</p>
          <p>createdAt: {format(feedback.createdAt, "MM-dd-yy")}</p>
          <p>updatedAt: {format(feedback.updatedAt, "MM-dd-yy")}</p>
          <p>comments: {feedback.comments}</p>
          {/* <ScrollArea>
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
          </ScrollArea> */}
        </div>
      </CardContent>
    </Card>
  );
};
