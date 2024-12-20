"use client";
import React from "react";
import { Feedback, User } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { DataDisplay } from "@/components/global/data-display/data-display";
import { ImageGrid } from "@/components/reusable/image-grid";
import { ScrollArea } from "@/components/ui/scroll-area";

const FeedbackInfo = ({
  feedback,
}: {
  feedback: Feedback & { user: User };
}) => {
  const { jobId, description, status, comments, title, page, images } =
    feedback;
  return (
    <aside className="relative w-[300px] min-w-[300px] max-w-[300px] border-r h-full p-2 overflow-y-auto bg-background ">
      <ScrollArea>
        <Badge className="absolute top-0 right-0">{status}</Badge>
        <div className="space-y-2">
          <DataDisplay title="Title" value={title} />
          <DataDisplay title="Page" value={page} />
          <DataDisplay title="JobId" value={jobId ?? "No Associated Job"} />
          <DataDisplay title="Description" value={description} />
          <DataDisplay title="Comments" value={comments ?? "No Comments"} />
        </div>
        {images && <ImageGrid enabled={false} images={images.split(",")} />}
      </ScrollArea>
    </aside>
  );
};

export default FeedbackInfo;
