"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { BriefcaseIcon, MoreVerticalIcon, ShuffleIcon } from "lucide-react";
import Link from "next/link";
import { useJobActions } from "@/hooks/job/use-job";

import { Job } from "@prisma/client";
import { JobStatus } from "@/types/job";

import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "@/components/custom/delete-dialog";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { formatDate } from "@/formulas/dates";

const statusColors = {
  [JobStatus.OPEN]: "bg-yellow-400 text-yellow-600",
  [JobStatus.COMPLETED]: "bg-primary",
  [JobStatus.IN_PROGRESS]: "bg-secondary",
  [JobStatus.CLOSED]: "bg-foreground",
};

const JobCard = ({ job }: { job: Job }) => {
  const isOpen = job.status === JobStatus.OPEN;
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-sm dark:shadow-primary/30">
      <CardContent className="relative p-4 flex items-center justify-between h-[100px]">
        <div className="absolute top-1 right-2 flex gap-1 items-center text-muted-foreground text-xs">
          <span className="italic">{formatDate(job.createdAt)}</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-3">
          <div
            className={cn(
              "flex w-10 h-10 rounded-full items-center justify-center shrink-0",
              statusColors[job.status as JobStatus]
            )}
          >
            <BriefcaseIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="flex text-base font-bold text-muted-foreground items-center">
              <Link
                href={`/admin/jobs/${job.id}`}
                className="flex items-center hover:underline"
              >
                {job.name}
              </Link>

              <span
                className={cn(
                  "ml-2 px-2 py-0.5 text-xs font-medium rounded-full",
                  statusColors[job.status as JobStatus]
                )}
              >
                {job.status}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground w-[50%] text-ellipsis line-clamp-2">
              {job.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/jobs/${job.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} /> Edit
          </Link>
          {isOpen && <JobActions jobId={job.id} jobName={job.name} />}
        </div>
      </CardContent>
    </Card>
  );
};

const JobActions = ({ jobId, jobName }: { jobId: string; jobName: string }) => {
  const { onJobDelete, jobDeleting } = useJobActions();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <TooltipWrapper content="More actions">
            <div className="flex items-center justify-center w-full h-full">
              <MoreVerticalIcon size={18} />
            </div>
          </TooltipWrapper>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-2" asChild>
          <DeleteDialog
            title="job"
            cfText={jobName}
            onConfirm={() => onJobDelete(jobId)}
            loading={jobDeleting}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default JobCard;