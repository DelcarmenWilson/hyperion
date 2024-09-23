"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import {
  useWorkflowActions,
  useWorkflowData,
  useWorkflowStore,
} from "@/hooks/workflow/use-workflow";

import { useEditorChanges, useEditorStore } from "@/hooks/workflow/use-editor";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert";
import { NodeSelect } from "@/components/workflow/node-select";
import { WorkflowForm } from "@/components/workflow/form";
import { Switch } from "@/components/ui/switch";

export const WorkflowHeader = () => {
  const { workflow } = useWorkflowData();
  const { onFormOpen, disabled } = useWorkflowStore();
  const { nodes } = useEditorStore();
  const { onNodeUpdateAll } = useEditorChanges();
  const {
    alertOpen,
    setAlertOpen,
    onWorkflowPublish,
    workflowPublishIsPending,
  } = useWorkflowActions();

  const router = useRouter();

  return (
    <>
      <WorkflowForm />

      <AlertModal
        title="Are you sure you want to exit without saving changes?"
        description="This action cannot be undone."
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => router.push("/workflows")}
        loading={false}
        height="300px"
      />
      <div className="flex justify-between items-center bg-background p-1 border-b">
        <Button
          onClick={() => {
            if (!disabled) setAlertOpen(true);
            else router.push("/workflows");
          }}
        >
          Back to Workflows
        </Button>
        <div className="flex items-center gap-2 text-2xl">
          <span className="capitalize font-bold">{workflow?.title}</span>
          <span> - {workflow?.description}</span>
          <Button variant="ghost" size="icon" onClick={onFormOpen}>
            <Pencil size={16} />
          </Button>
          <Switch
            defaultChecked={workflow?.published}
            onCheckedChange={onWorkflowPublish}
            disabled={workflowPublishIsPending}
          />
        </div>
        <div className="flex items-center gap-2">
          <NodeSelect nodesCount={nodes.length} />
          <Button disabled={disabled} onClick={() => onNodeUpdateAll()}>
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
};
