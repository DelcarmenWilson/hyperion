"use client";
import React from "react";
import { useLeadActions } from "@/hooks/lead/use-lead";

import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserSelect } from "@/components/user/select";
import { Reply } from "lucide-react";

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
      <DialogContent>
        <CustomDialogHeader
          icon={Reply}
          title="Transfer Lead"
          subTitle={leadFullName}
        />
        <div className="flex flex-col gap-2 p-2">
          <p className="text-3xl text-primary font-bold text-center">
            {leadFullName}
          </p>
          <p className="text-sm text-muted-foreground font-bold">
            Select a agent to transfer the lead to
          </p>
          <UserSelect userId={userId} setUserId={setUserId} />
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button
              onClick={onTransferFormClose}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={loading || !userId}
              onClick={onLeadUpdateByIdTransfer}
            >
              Transfer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
