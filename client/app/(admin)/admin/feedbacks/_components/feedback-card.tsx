"use client";
import { cn } from "@/lib/utils";
import { EyeIcon, MessageSquarePlus } from "lucide-react";
import Link from "next/link";

import { FeedbackStatus } from "@/types/feedback";
import { Feedback } from "@prisma/client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const statusColors = {
  [FeedbackStatus.PENDING]: "bg-foreground text-background",
  [FeedbackStatus.IN_PROGRESS]: "bg-secondary text-foreground",
  [FeedbackStatus.COMPLETED]: "bg-primary text-white",
};

const FeedbackCard = ({
  feedback,
  admin,
}: {
  feedback: Feedback;
  admin: boolean;
}) => {
  const baseUrl = admin ? "/admin/feedbacks" : "/feedback";
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-sm dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3 overflow-ellipsis">
          <div
            className={cn(
              "flex w-10 h-10 rounded-full items-center justify-center",
              statusColors[feedback.status as FeedbackStatus]
            )}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="flex text-base font-bold text-muted-foreground items-center">
              <Link
                href={`${baseUrl}/${feedback.id}`}
                className="flex items-center hover:underline"
              >
                {feedback.title}
              </Link>

              <span
                className={cn(
                  "ml-2 px-2 py-0.5 text-xs font-medium  rounded-full",
                  statusColors[feedback.status as FeedbackStatus]
                )}
              >
                {feedback.status}
              </span>
            </h3>

            <div className="w-[70%] text-ellipsis line-clamp-2">
              <p className="text-xs text-muted-foreground">
                {feedback.description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`${baseUrl}/${feedback.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "flex items-center gap-2"
            )}
          >
            <EyeIcon size={16} /> View
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
