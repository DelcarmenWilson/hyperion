"use client";
import React, { useState } from "react";
import { useLead, useLeadActions } from "@/hooks/use-lead";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserSelect } from "@/components/user/select";

export const TransferForm = () => {
  const { isTransferFormOpen, onTransferFormClose, leadId, leadFullName } =
    useLead();
  const { onLeadUpdateByIdTransfer } = useLeadActions(onTransferFormClose);

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  const onTransferLead = async () => {
    setLoading(true);
    onLeadUpdateByIdTransfer(leadId, selectedUserId);
    setLoading(false);
  };

  return (
    <Dialog open={isTransferFormOpen} onOpenChange={onTransferFormClose}>
      <DialogContent className="flex flex-col justify-start h-auto max-w-screen-sm">
        <h3 className="text-2xl font-semibold py-2">
          Transfer Lead{" - "}
          <span className="text-primary">{leadFullName}</span>
        </h3>
        <p className="text-md text-muted-foreground font-bold">
          Select a agent to transfer the lead to
        </p>
        <UserSelect userId={selectedUserId} setUserId={setSelectedUserId} />
        <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
          <Button onClick={onTransferFormClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button
            disabled={loading || !selectedUserId}
            onClick={onTransferLead}
          >
            Transfer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
