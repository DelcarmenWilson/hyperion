"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { Feedback } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";
import { FeedbackCard } from "./card";

type FeedbackListProps = {
  initFeedbacks: Feedback[];
};

export const FeedbackList = ({ initFeedbacks }: FeedbackListProps) => {
  const [status, setStatus] = useState("New");
  const [feedbacks, setFeedbacks] = useState(initFeedbacks);
  const [currentFeedbacks, setCurrentFeedbacks] = useState(
    feedbacks.filter((e) => e.status.includes(status))
  );
  const onSetStatus = (st: string) => {
    setStatus(st);
    setCurrentFeedbacks(
      initFeedbacks.filter((e) => e.status.includes(st == "%" ? "" : st))
    );
  };

  useEffect(() => {
    const onFeedbackInserted = (newFeedback: Feedback) => {
      const existing = feedbacks?.find((e) => e.id == newFeedback.id);
      if (existing == undefined)
        setFeedbacks((feedbacks) => [...feedbacks!, newFeedback]);
    };

    const onFeedbackUpdated = (updatedFeedback: Feedback) => {
      setFeedbacks((feedbacks) => {
        if (!feedbacks) return feedbacks;
        return feedbacks
          .filter((e) => e.id != updatedFeedback.id)
          .concat(updatedFeedback);
      });
    };
    userEmitter.on("feedbackInserted", (info) => onFeedbackInserted(info));
    userEmitter.on("feedbackUpdated", (info) => onFeedbackUpdated(info));
    // eslint-disable-next-line
  }, []);

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
        {initFeedbacks.length ? (
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
            <p>You have not leave any feedback!</p>
          </div>
        )}
      </ScrollArea>
    </>
  );
};
