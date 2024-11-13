"use client";
import React, { useEffect, useState } from "react";
import { FeedbackStatus, ShortFeedback } from "@/types/feedback";

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
  initFeedbacks: ShortFeedback[];
  admin?: boolean;
}) => {
  const [feedbacks, setFeedbacks] = useState(initFeedbacks);
  const [status, setStatus] = useState<FeedbackStatus | "All">(
    FeedbackStatus.PENDING
  );
  const [agent, setAgent] = useState("All");
  const feedbackStatuses = getEnumValues(FeedbackStatus);

  const groupedAgents = initFeedbacks.reduce((groups, feedback) => {
    if (!groups[feedback.user.firstName]) groups[feedback.user.firstName] = 1;
    else groups[feedback.user.firstName] += 1;
    return groups;
  }, {} as Record<string, number>);

  useEffect(() => {
    let filtered = [...initFeedbacks];
    if (status != "All") filtered = filtered.filter((e) => e.status == status);
    if (agent != "All")
      filtered = filtered.filter((e) => e.user.firstName == agent);
    setFeedbacks(filtered);
  }, [status, agent]);
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
              <SelectItem value="All">All </SelectItem>
              {feedbackStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Agent</p>
          <Select name="ddlAgent" onValueChange={setAgent} defaultValue={agent}>
            <SelectTrigger className="max-w-max">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="w-[150px]">
              <SelectItem value="All">All </SelectItem>
              {Object.entries(groupedAgents || {})
                .sort()
                .map(([id, count]) => (
                  <SelectItem key={id} value={id}>
                    {id} ({count})
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
        <FeedbackCard
          key={feedback.id}
          id={feedback.id}
          title={feedback.title}
          description={feedback.description}
          status={feedback.status}
          createdAt={feedback.createdAt}
          firstName={feedback.user.firstName}
          images={!!feedback.images}
          admin={admin}
        />
      ))}
    </div>
  );
};

export default FeedbackList;
