"use client";
import React from "react";
import { useLeadActions } from "@/hooks/lead/use-lead";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/global/custom-dialog";
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
    <CustomDialog
      title="Transfer Lead"
      subTitle={leadFullName}
      description="Transfer Form"
      open={isTransferFormOpen}
      onClose={onTransferFormClose}
    >
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
    </CustomDialog>
  );
};
