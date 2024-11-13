"use client";
import { cn } from "@/lib/utils";
import { EyeIcon, ImageIcon, MessageSquarePlus } from "lucide-react";
import Link from "next/link";

import { FeedbackStatus } from "@/types/feedback";
import { Feedback } from "@prisma/client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/formulas/dates";

const statusColors = {
  [FeedbackStatus.PENDING]: "bg-foreground text-background",
  [FeedbackStatus.IN_PROGRESS]: "bg-secondary text-foreground",
  [FeedbackStatus.COMPLETED]: "bg-primary text-white",
};

type Props = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  firstName: string;
  images: boolean;
  admin: boolean;
};
const FeedbackCard = ({
  id,
  title,
  description,
  status,
  createdAt,
  firstName,
  images,
  admin,
}: Props) => {
  const baseUrl = admin ? "/admin/feedbacks" : "/feedback";
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-sm dark:shadow-primary/30">
      <CardContent className="relative p-4 flex items-center justify-between h-[100px]">
        <div className="absolute top-1 right-2 flex gap-1 items-center text-muted-foreground text-sm">
          {images && (
            <ImageIcon className="stroke-secondary-foreground h-5 w-5" />
          )}
          <span>{firstName}</span>
          <span className="italic">{formatDate(createdAt)}</span>
        </div>
        <div className="flex items-center justify-end space-x-3 overflow-ellipsis">
          <div
            className={cn(
              "flex w-10 h-10 rounded-full items-center justify-center  shrink-0",
              statusColors[status as FeedbackStatus]
            )}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="flex text-base font-bold text-muted-foreground items-center">
              <Link
                href={`${baseUrl}/${id}`}
                className="flex items-center hover:underline"
              >
                {title}
              </Link>

              <span
                className={cn(
                  "ml-2 px-2 py-0.5 text-xs font-medium rounded-full",
                  statusColors[status as FeedbackStatus]
                )}
              >
                {status}
              </span>
            </h3>

            <p className="text-xs text-muted-foreground w-[50%] text-ellipsis line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`${baseUrl}/${id}`}
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
