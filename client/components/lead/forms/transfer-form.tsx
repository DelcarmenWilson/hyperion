"use client";
import React from "react";
import { useLeadActions } from "@/hooks/lead/use-lead";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserSelect } from "@/components/user/select";

export const TransferForm = () => {
  const {
    userId,
    setUserId,
    loading,
    leadFullName,
    isTransferFormOpen,
    onTransferFormClose,
    onLeadUpdateByIdTransfer,
  } = useLeadActions();

  return (
    <Dialog open={isTransferFormOpen} onOpenChange={onTransferFormClose}>
      <DialogDescription className="hidden">Transfer Form</DialogDescription>
      <DialogContent className="flex flex-col justify-start h-auto max-w-screen-sm">
        <h3 className="text-2xl font-semibold py-2">
          Transfer Lead -<span className="text-primary">{leadFullName}</span>
        </h3>
        <p className="text-md text-muted-foreground font-bold">
          Select a agent to transfer the lead to
        </p>
        <UserSelect userId={userId} setUserId={setUserId} />
        <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
          <Button onClick={onTransferFormClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button
            disabled={loading || !userId}
            onClick={onLeadUpdateByIdTransfer}
          >
            Transfer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
