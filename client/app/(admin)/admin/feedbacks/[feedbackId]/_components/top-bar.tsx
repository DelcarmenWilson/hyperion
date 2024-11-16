"use client";
import { Feedback, User } from "@prisma/client";

import BackBtn from "@/components/global/back-btn";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/formulas/dates";

const Topbar = ({ feedback }: { feedback: Feedback & { user: User } }) => {
  const { title, description, status, createdAt, user } = feedback;
  return (
    <div className="flex p-2 border-b border-separate justify-between w-full h-[60px] bg-background z-10">
      <div className="flex flex-1 gap-1 ">
        <BackBtn />
        <div className="capitalize max-w-[500px] truncate">
          <p className="font-bold">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="relative flex flex-col shrink-0 gap-1 justify-end">
        <Badge className="w-fit">{status}</Badge>
        <div className="text-muted-foreground text-xs">
          <span className="font-bold">{user.firstName}</span>
          <span className="italic">{formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
