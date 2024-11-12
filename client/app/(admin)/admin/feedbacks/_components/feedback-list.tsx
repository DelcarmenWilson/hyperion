"use client";
import React, { useEffect, useState } from "react";
import { Feedback } from "@prisma/client";
import { FeedbackStatus } from "@/types/feedback";

import FeedbackCard from "./feedback-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEnumValues } from "@/lib/helper/enum-converter";
import { EmptyCard } from "@/components/reusable/empty-card";

const FeedbackList = ({
  initFeedbacks,
  admin = false,
}: {
  initFeedbacks: Feedback[];
  admin?: boolean;
}) => {
  const [feedbacks, setFeedbacks] = useState(initFeedbacks);
  const [status, setStatus] = useState<FeedbackStatus>(FeedbackStatus.PENDING);
  const feedbackStatuses = getEnumValues(FeedbackStatus);

  useEffect(() => {
    if (!status) return;
    setFeedbacks(initFeedbacks.filter((e) => e.status == status));
  }, [status]);
  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="flex gap-2 p-2 bg-background items-center justify-between sticky">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Status</p>
          <Select
            name="ddlStatus"
            onValueChange={(e) => {
              setStatus(e as FeedbackStatus);
            }}
            defaultValue={status}
          >
            <SelectTrigger className="max-w-max">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="w-[100px]">
              {feedbackStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Feedbacks:</p>
          <span className="font-bold italic"> ({feedbacks.length})</span>
        </div>
      </div>
      {feedbacks.length == 0 && <EmptyCard title="No feedbacks found" />}
      {feedbacks.map((feedback) => (
        <FeedbackCard key={feedback.id} feedback={feedback} admin={admin} />
      ))}
    </div>
  );
};

export default FeedbackList;
