"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { BriefcaseIcon, MoreVerticalIcon, ShuffleIcon } from "lucide-react";
import Link from "next/link";
import { useJobActions } from "@/hooks/job/use-job";
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
import { capitalize } from "@/formulas/text";
import { statusColors } from "../_constants/colors";

type Props = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: Date;
};
const JobCard = ({ id, name, description, status, createdAt }: Props) => {
  const isOpen = status === JobStatus.OPEN;
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-sm dark:shadow-primary/30">
      <CardContent className="relative p-4 flex items-center justify-between h-[100px]">
        <div className="absolute top-2 right-3 flex gap-1 items-center text-muted-foreground text-xs">
          <span className="italic">{formatDate(createdAt)}</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-3">
          <div
            className={cn(
              "flex w-10 h-10 rounded-full items-center justify-center shrink-0",
              statusColors[status as JobStatus]
            )}
          >
            <BriefcaseIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="flex text-base font-bold text-muted-foreground items-center">
              <Link
                href={`/admin/jobs/${id}`}
                className="flex items-center hover:underline"
              >
                {name}
              </Link>

              <span
                className={cn(
                  "ml-2 px-2 py-0.5 text-xs font-medium rounded-full",
                  statusColors[status as JobStatus]
                )}
              >
                {capitalize(status.replace("_", " "))}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground w-[50%] text-ellipsis line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/jobs/${id}`}
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
          {isOpen && <JobActions jobId={id} jobName={name} />}
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
