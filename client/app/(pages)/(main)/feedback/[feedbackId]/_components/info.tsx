"use client";
import React, { useState } from "react";
import { Edit } from "lucide-react";
import { useFeedbackActions } from "@/hooks/feedback/use-feedback";

import { Feedback } from "@prisma/client";
import { FeedbackStatus } from "@/types/feedback";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataDisplayBox,
  DataDisplayItalic,
} from "@/components/global/data-display/data-display";
import DeleteDialog from "@/components/custom/delete-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { FeedbackForm } from "./form";
import { formatDate } from "@/formulas/dates";

const FeedbackInfo = ({ feedback }: { feedback: Feedback }) => {
  const [showForm, setShowForm] = useState(false);
  const { onDeleteFeedback, deletingFeedback } = useFeedbackActions();

  const {
    id,
    title,
    page,
    description,
    images,
    status,
    comments,
    createdAt,
    updatedAt,
  } = feedback;

  const isPending = status == FeedbackStatus.PENDING;
  const isCompleted = status == FeedbackStatus.COMPLETED;
  return (
    <div className="relative w-full h-full overflow-hidden">
      <ScrollArea>
        <div className="flex justify-between items-center p-2 ">
          <Badge>{status}</Badge>
          <div className="flex gap-2 w-fit">
            {!isCompleted && (
              <Button variant="ghost" onClick={() => setShowForm(true)}>
                <Edit size={15} />
              </Button>
            )}

            {isPending && (
              <DeleteDialog
                title="feedback"
                cfText={title}
                onConfirm={() => onDeleteFeedback(id)}
                loading={deletingFeedback}
              />
            )}
          </div>
        </div>

        <div className="container space-y-2">
          <DataDisplayBox title="Title" value={title} />
          <DataDisplayBox title="Page" value={page} />
          <DataDisplayBox title="Description" value={description} />
          <DataDisplayBox title="Comments" value={comments ?? "No Comments"} />

          <div className="p-2">
            <div className="bg-gradient p-1">
              <p className="text-center bg-background text-primary font-bold p-1">
                Feedback Status
              </p>
            </div>
            <div className="grid grid-cols-2 mt-2">
              <DataDisplayItalic
                title="Created Date"
                value={formatDate(createdAt)}
              />
              <DataDisplayItalic
                title="Updated Date"
                value={formatDate(updatedAt)}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
      <FeedbackForm
        open={showForm}
        onClose={() => setShowForm(false)}
        feedback={feedback}
      />
    </div>
  );
};

export default FeedbackInfo;
