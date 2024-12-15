"use client";
import React, { useState } from "react";
import { Edit } from "lucide-react";
import { useMiniJobActions } from "@/hooks/job/use-mini-job";

import { JobStatus } from "@/types/job";
import { MiniJob } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataDisplayItalic } from "@/components/global/data-display/data-display";
import DeleteDialog from "@/components/custom/delete-dialog";
import MiniJobForm from "./form";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formatDate } from "@/formulas/dates";

const MiniJobInfo = ({ miniJob }: { miniJob: MiniJob }) => {
  const [showForm, setShowForm] = useState(false);
  const {
    onDeleteMiniJob,
    deletingMiniJob,
    onStartMiniJob,
    startingMiniJob,
    onCompleteMiniJob,
    completingMiniJob,
  } = useMiniJobActions();
  const { id, name, description, status, comments, startedAt, completedAt } =
    miniJob;

  const isOpen = status == JobStatus.OPEN;
  const isStarted = status == JobStatus.IN_PROGRESS;
  const isCompleted = status == JobStatus.COMPLETED;
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

            {isOpen && (
              <DeleteDialog
                title="mini-job"
                cfText={name}
                onConfirm={() => onDeleteMiniJob(id)}
                loading={deletingMiniJob}
              />
            )}
          </div>
        </div>
        <div className="container space-y-2">
          <div className="border border-separate p-2">
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="text-foreground font-semibold pl-3">{name}</p>
          </div>

          <div className="border border-separate p-2">
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="text-foreground font-semibold pl-3">{description}</p>
          </div>

          <div className="border border-separate p-2">
            <p className="text-xs text-muted-foreground">Comments</p>
            <p className="text-foreground font-semibold pl-3">
              {comments ?? "No Comments"}
            </p>
          </div>

          <div className="p-2">
            <div className="bg-gradient p-1">
              <p className="text-center bg-background text-primary font-bold p-1">
                Job Status
              </p>
            </div>
            <div className="grid grid-cols-2 mt-2">
              <DataDisplayItalic
                title="Start Date"
                value={startedAt ? formatDate(startedAt) : "Not yet started"}
              />
              <DataDisplayItalic
                title="Completed Date"
                value={
                  completedAt ? formatDate(completedAt) : "Not yet completed"
                }
              />
            </div>
          </div>

          <div className="text-right pe-2">
            {isOpen && (
              <Button
                variant="outlineprimary"
                disabled={startingMiniJob}
                onClick={() => onStartMiniJob(id)}
              >
                Start Job
              </Button>
            )}
            {isStarted && (
              <Button
                variant="outlineprimary"
                disabled={completingMiniJob}
                onClick={() => onCompleteMiniJob(id)}
              >
                Completed Job
              </Button>
            )}
          </div>
        </div>
      </ScrollArea>
      <MiniJobForm
        open={showForm}
        onClose={() => setShowForm(false)}
        miniJob={miniJob}
      />
    </div>
  );
};

export default MiniJobInfo;
