"use client";
import React, { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useJobStore } from "@/stores/job-store";

import { Job } from "@prisma/client";
import { JobStatus } from "@/types/job";

import { Button } from "@/components/ui/button";
import { EmptyCard } from "@/components/reusable/empty-card";
import JobCard from "./job-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getEnumValues } from "@/lib/helper/enum-converter";

const JobList = ({ initJobs }: { initJobs: Job[] }) => {
  const [jobs, setJobs] = useState(initJobs);
  const { status, setStatus, sorted, toggleSorted } = useJobStore();
  const jobStatuses = getEnumValues(JobStatus);

  useEffect(() => {
    let filtered = [...initJobs];
    if (status != "All") filtered = filtered.filter((e) => e.status == status);

    filtered.sort((a, b) =>
      sorted
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime()
    );
    setJobs(filtered);
  }, [status, sorted]);
  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="flex gap-2 p-2 bg-background items-center justify-between sticky">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Status</p>
          <Select
            name="ddlStatus"
            onValueChange={(e) => {
              setStatus(e as JobStatus);
            }}
            defaultValue={status}
          >
            <SelectTrigger className="max-w-max">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="w-[100px]">
              <SelectItem value="All">All </SelectItem>
              {jobStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.name}
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

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Jobs:</p>
          <span className="font-bold italic"> ({jobs.length})</span>
        </div>
      </div>
      {jobs.length == 0 && <EmptyCard title="No jobs found" />}
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          id={job.id}
          name={job.name}
          description={job.description}
          status={job.status}
          createdAt={job.createdAt}
        />
      ))}
    </div>
  );
};

export default JobList;
