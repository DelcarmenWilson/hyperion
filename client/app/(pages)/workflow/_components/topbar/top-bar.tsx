"use client";

import BackBtn from "@/components/global/back-btn";
import ExecuteBtn from "./execute-btn";
import SaveBtn from "./save-btn";

type Props = {
  title: string;
  subTitle?: string;
  workflowId: string;
};
const Topbar = ({ title, subTitle, workflowId }: Props) => {
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky bg-background z-10">
      <div className="flex flex-1 gap-1">
        <BackBtn />
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subTitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subTitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 gap-1 justify-end">
        <ExecuteBtn workflowId={workflowId} />
        <SaveBtn workflowId={workflowId} />
      </div>
    </header>
  );
};

export default Topbar;
