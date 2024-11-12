import React from "react";
import { Feedback, User } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataDisplayItalic } from "@/components/global/data-display/data-display";
import { Badge } from "@/components/ui/badge";

const FeedbackInfo = ({
  feedback,
}: {
  feedback: Feedback & { user: User };
}) => {
  const { jobId, description, status, comments, title, page, images } =
    feedback;
  return (
    <aside className="relative w-[270px] min-w-[270px] max-w-[270px] border-r-2 border h-full p-2 px-4 overflow-hidden bg-background ">
      <ScrollArea>
        <Badge className="absolute top-0 right-0">{status}</Badge>
        <DataDisplayItalic title="Title" value={title} />
        <DataDisplayItalic title="Page" value={page} />
        <DataDisplayItalic title="JobId" value={jobId ?? "No Associated Job"} />
        <DataDisplayItalic title="Description" value={description} />
        <DataDisplayItalic title="Comments" value={comments ?? "No Comments"} />

        <DataDisplayItalic title="Images" value={images ?? "No Images"} />
      </ScrollArea>
    </aside>
  );
};

export default FeedbackInfo;
