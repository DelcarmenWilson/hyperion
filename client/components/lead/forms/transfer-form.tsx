"use client";
import React, { useContext, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import SocketContext from "@/providers/socket";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { leadUpdateByIdTransfer } from "@/actions/lead";
import { UserSelect } from "@/components/user/select";

type ShareFormProps = {
  leadId: string;
  onClose: () => void;
};
export const TransferForm = ({ leadId, onClose }: ShareFormProps) => {
  const { socket } = useContext(SocketContext).SocketState;
  const user = useCurrentUser();
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  const onTransferLead = async () => {
    if (!selectedUserId) return;
    setLoading(true);
    const transferedLead = await leadUpdateByIdTransfer(leadId, selectedUserId);
    if (transferedLead.success) {
      toast.success(transferedLead.success);
      socket?.emit(
        "lead-transfered",
        selectedUserId,
        user?.name,
        leadId,
        transferedLead.success
      );
      userEmitter.emit("leadTransfered", leadId);
      onClose();
    } else toast.error(transferedLead.error);
    setLoading(false);
  };

  return (
    <div>
      <p className="text-md text-muted-foreground font-bold">
        Select a agent to transfer the lead to
      </p>
      <UserSelect userId={selectedUserId} setUserId={setSelectedUserId} />
      <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
        <Button onClick={onClose} type="button" variant="outline">
          Cancel
        </Button>
        <Button disabled={loading || !selectedUserId} onClick={onTransferLead}>
          Transfer
        </Button>
      </div>
    </div>
  );
};
