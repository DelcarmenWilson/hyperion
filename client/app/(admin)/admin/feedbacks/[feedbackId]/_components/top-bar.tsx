"use client";

import BackBtn from "@/components/global/back-btn";
import { Feedback, User } from "@prisma/client";

const Topbar = ({ feedback }: { feedback: Feedback & { user: User } }) => {
  const { title, description, status } = feedback;
  return (
    <div className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] bg-background z-10">
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
      <div className="flex shrink-0 gap-1 justify-end">{status}</div>
    </div>
  );
};

export default Topbar;
