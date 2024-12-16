"use client";
import React, { useState } from "react";
import { useWorkflowActions } from "@/hooks/use-workflow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowId: string;
  workflowName: string;
};

const DeleteWorkflowDialog = ({
  open,
  setOpen,
  workflowId,
  workflowName,
}: Props) => {
  const [confirmText, setConfirmText] = useState("");
  const { onDeleteWorkflow, workflowDeleting } = useWorkflowActions(() => {
    setConfirmText("");
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2">
              <p>
                If you are sure, enter <b>{workflowName}</b> to confirm:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || workflowDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              onDeleteWorkflow(workflowId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorkflowDialog;
