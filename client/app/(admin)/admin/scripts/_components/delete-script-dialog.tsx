"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { deleteScript } from "@/actions/script/delete-script";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  scriptId: string;
  scriptName: string;
};
const DeleteScriptDialog = ({ open, setOpen, scriptId, scriptName }: Props) => {
  const [confirmText, setConfirmText] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: deleteScript,
    onSuccess: () => {
      toast.success("Script deleted successfully", { id: scriptId });
      setConfirmText("");
    },
    onError: () => toast.error("Something went wrong", { id: scriptId }),
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this script, you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2">
              <p>
                If you are sure, enter <b>{scriptName}</b> to confirm:
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
            disabled={confirmText !== scriptName || isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              toast.loading("Deleting script", { id: scriptId });
              mutate(scriptId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteScriptDialog;
