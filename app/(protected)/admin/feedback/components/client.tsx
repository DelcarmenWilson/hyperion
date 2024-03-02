"use client";
import { useState } from "react";
import { FullFeedback } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";

type FeedbacksClientProps = {
  feedbacks: FullFeedback[];
};

export const FeedbacksClient = ({ feedbacks }: FeedbacksClientProps) => {
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
      <div className="flex items-center gap-2 my-2">
        <span className="text-sm text-muted-foreground">Status</span>
        <Select
          name="ddlStatus"
          onValueChange={onSetStatus}
          defaultValue={status}
        >
          <SelectTrigger className=" w-1/3">
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
      <DataTable
        columns={columns}
        data={currentFeedbacks}
        searchKey="headLine"
      />
    </>
  );
};
