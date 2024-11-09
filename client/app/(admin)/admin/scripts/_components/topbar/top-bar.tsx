"use client";

import BackBtn from "@/components/global/back-btn";
import SaveBtn from "./save-btn";
import PublishBtn from "./publish-btn";
import UnPublishBtn from "./unpublish-btn";

type Props = {
  name: string;
  description?: string | null;
  scriptId: string;
  isDraft: boolean;
};
const Topbar = ({ name, description, scriptId, isDraft }: Props) => {
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
      <div className="flex flex-1 gap-1 justify-end">
        {isDraft ? (
          <>
            <PublishBtn scriptId={scriptId} />
            <SaveBtn scriptId={scriptId} />
          </>
        ) : (
          <UnPublishBtn scriptId={scriptId} />
        )}
      </div>
    </div>
  );
};

export default Topbar;
