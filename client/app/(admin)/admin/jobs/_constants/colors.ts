import { JobStatus } from "@/types/job";

export const statusColors = {
    [JobStatus.OPEN]: "bg-yellow-400 text-yellow-600",
    [JobStatus.COMPLETED]: "bg-primary",
    [JobStatus.IN_PROGRESS]: "bg-secondary",
    [JobStatus.CLOSED]: "bg-foreground",
  };