"use client";

import BackBtn from "@/components/global/back-btn";
import { Badge } from "@/components/ui/badge";
import { Job } from "@prisma/client";

const Topbar = ({ job }: { job: Job }) => {
  const { name, description, status } = job;
  return (
    <div className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky bg-background z-10">
      <div className="flex flex-1 gap-1">
        <BackBtn />
        <div className="capitalize">
          <p className="font-bold text-ellipsis truncate">{name}</p>
          {description && (
            <p className="text-xs text-muted-foreground text-ellipsis truncate">
              {description}
            </p>
          )}
        </div>
      </div>
      <Badge> {status}</Badge>
    </div>
  );
};

export default Topbar;
