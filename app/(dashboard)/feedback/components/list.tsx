"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Feedback } from "@prisma/client";
import { FeedbackCard } from "./card";
import { useState } from "react";

type FeedbackListProps = {
  feedbacks: Feedback[];
};

export const FeedbackList = ({ feedbacks }: FeedbackListProps) => {
  const [status, setStatus] = useState("New");
  const [currentFeedbacks, setCurrentFeedbacks] = useState(
    feedbacks.filter((e) => e.status.includes(status))
  );
  const onSetStatus = (st: string) => {
    setStatus(st);
    setCurrentFeedbacks(
      feedbacks.filter((e) => e.status.includes(st == "%" ? "" : st))
    );
  };
  return (
    <>
      <div className="flex justify-between items-center gap-2 pt-2 pr-1">
        <h3 className="ml-1 text-sm font-semibold">Your Feedbacks</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status</span>
          <Select
            name="ddlStatus"
            onValueChange={onSetStatus}
            defaultValue={status}
          >
            <SelectTrigger className="w-max">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="%">All</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea>
        {feedbacks.length ? (
          <>
            {currentFeedbacks.length ? (
              <div className="grid grid-cols-3 gap-2 p-2">
                {currentFeedbacks.map((feedback) => (
                  <FeedbackCard key={feedback.id} feedback={feedback} />
                ))}
              </div>
            ) : (
              <p className="text-center py-10">No results</p>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>You have not leave any feeback!</p>
          </div>
        )}
      </ScrollArea>
    </>
  );
};
