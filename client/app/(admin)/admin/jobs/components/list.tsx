"use client";
import React, { useState } from "react";
import { Job } from "@prisma/client";
import { JobCard } from "./card";

type JobListProps = {
  initJobs: Job[];
};
export const JobList = ({ initJobs }: JobListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(initJobs);

  const onJobInserted = (e: Job) => {
    setJobs((jobs) => [...jobs, e]);
    setIsOpen(false);
  };

  const onJobDeleted = (id: string) => {
    setJobs((jobs) => jobs.filter((e) => e.id !== id));
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      {jobs.map((job) => (
        <JobCard key={job.id} initJob={job} onJobDeleted={onJobDeleted} />
      ))}
    </div>
  );
};
