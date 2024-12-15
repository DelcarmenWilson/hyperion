"use client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Job } from "@prisma/client";

import UpdateJobDialog from "./update-job-dialog";

import { JobStatus } from "@/types/job";
import { capitalize } from "@/formulas/text";
import { statusColors } from "../_constants/colors";

const Topbar = ({ job }: { job: Job }) => {
  const { name, description, status } = job;
  return (
    <div className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky bg-background z-10">
      <div className="flex flex-1 gap-1 items-center">
        <Link href="/admin/jobs">
          <ChevronLeft size={20} />
        </Link>
        <div className="capitalize">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ellipsis truncate">{name}</span>
            <UpdateJobDialog job={job} />
          </div>
          {description && (
            <p className="text-xs text-muted-foreground text-ellipsis truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      <span
        className={cn(
          "flex-center ml-2 px-2 py-0.5 text-xs font-medium rounded-full",
          statusColors[status as JobStatus]
        )}
      >
        {capitalize(status.replace("_", " "))}
      </span>
    </div>
  );
};

export default Topbar;
