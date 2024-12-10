"use client";
import React, { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeedbackStore } from "@/stores/feedback-store";

import { FeedbackStatus, ShortFeedback } from "@/types/feedback";

import { Button } from "@/components/ui/button";
import { EmptyCard } from "@/components/reusable/empty-card";
import FeedbackCard from "./feedback-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEnumValues } from "@/lib/helper/enum-converter";

const FeedbackList = ({
  initFeedbacks,
  admin = false,
}: {
  initFeedbacks: ShortFeedback[];
  admin?: boolean;
}) => {
  const [feedbacks, setFeedbacks] = useState(initFeedbacks);
  const {
    status,
    setStatus,
    agent,
    setAgent,
    page,
    setPage,
    sorted,
    toggleSorted,
  } = useFeedbackStore();
  const feedbackStatuses = getEnumValues(FeedbackStatus);

  const groupedAgents = initFeedbacks.reduce((groups, feedback) => {
    if (!groups[feedback.user.firstName]) groups[feedback.user.firstName] = 1;
    else groups[feedback.user.firstName] += 1;
    return groups;
  }, {} as Record<string, number>);

  const groupedPages = initFeedbacks.reduce((groups, feedback) => {
    if (!groups[feedback.page]) groups[feedback.page] = 1;
    else groups[feedback.page] += 1;
    return groups;
  }, {} as Record<string, number>);

  useEffect(() => {
    let filtered = [...initFeedbacks];
    if (status != "All") filtered = filtered.filter((e) => e.status == status);
    if (agent != "All")
      filtered = filtered.filter((e) => e.user.firstName == agent);
    if (page != "All") filtered = filtered.filter((e) => e.page == page);
    filtered.sort((a, b) =>
      sorted
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime()
    );
    setFeedbacks(filtered);
  }, [status, agent, page, sorted]);
  return (
    <div className="flex flex-1 flex-col gap-2 overflow-hidden">
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

        {admin && (
          <>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Agent</p>
              <Select
                name="ddlAgent"
                onValueChange={setAgent}
                defaultValue={agent}
              >
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
              <p className="text-sm text-muted-foreground">Page</p>
              <Select
                name="ddlPage"
                onValueChange={setPage}
                defaultValue={page}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All </SelectItem>

                  {Object.entries(groupedPages || {})
                    .sort()
                    .map(([id, count]) => (
                      <SelectItem key={id} value={id}>
                        {id} ({count})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2" onClick={toggleSorted}>
              <span className="sr-only">Sort by date</span>
              <span className="text-sm text-muted-foreground">Created At</span>
              <ArrowDown
                size={15}
                className={cn("transition-transform ", sorted && "rotate-180")}
              />
            </Button>
          </>
        )}

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Feedbacks:</p>
          <span className="font-bold italic"> ({feedbacks.length})</span>
        </div>
      </div>
      <ScrollArea>
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
            page={feedback.page}
            admin={admin}
          />
        ))}
      </ScrollArea>
    </div>
  );
};

export default FeedbackList;
