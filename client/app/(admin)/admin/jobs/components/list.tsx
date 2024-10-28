"use client";
import { Job } from "@prisma/client";
import { JobCard } from "./card";

type JobListProps = {
  jobs: Job[];
};
export const JobList = ({ jobs }: JobListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
