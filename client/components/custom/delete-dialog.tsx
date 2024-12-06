"use client";
import React, { useState } from "react";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

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
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  triggerText?: string;
  btnClass?: string;
  title: string;
  cfText: string;
  onConfirm: () => void;
  loading: boolean;
};
const DeleteDialog = ({
  triggerText = "Delete",
  btnClass,
  title,
  cfText,
  onConfirm,
  loading,
}: Props) => {
  const [confirmText, setConfirmText] = useState("");
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className={cn("gap-2 w-full", btnClass)}>
          <span className="sr-only">Delete {title}</span>
          <Trash size={16} /> {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this {title}, you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2">
              <p>
                If you are sure, enter <b>"{cfText}"</b> to confirm:
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
            disabled={confirmText !== cfText || loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              setConfirmText("");
              onConfirm();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
