"use client";
import React, { useContext, useState } from "react";
import { X } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import SocketContext from "@/providers/socket";

import { toast } from "sonner";

import { User } from "@prisma/client";

import { Button } from "@/components/ui/button";

import { leadUpdateByIdShare, leadUpdateByIdUnShare } from "@/actions/lead";
import { UserSelect } from "@/components/user/select";

type ShareFormProps = {
  leadId: string;
  sharedUser: User | null | undefined;
  onClose: () => void;
};
export const ShareForm = ({ leadId, sharedUser, onClose }: ShareFormProps) => {
  const { socket } = useContext(SocketContext).SocketState;
  const user = useCurrentUser();
  const [selectedUserId, setSelectedUserId] = useState(sharedUser?.id);
  const [loading, setLoading] = useState(false);

  const onShareLead = async () => {
    if (!selectedUserId) return;
    setLoading(true);
    const updatedLead = await leadUpdateByIdShare(leadId, selectedUserId);
    if (updatedLead.success) {
      toast.success(updatedLead.message);
      socket?.emit(
        "lead-shared",
        selectedUserId,
        user?.name,
        leadId,
        updatedLead.success
      );
      onClose();
    } else toast.error(updatedLead.error);
    setLoading(false);
  };
  const onUnShareLead = async () => {
    setLoading(true);
    const updatedLead = await leadUpdateByIdUnShare(leadId);
    if (updatedLead.success) {
      toast.success(updatedLead.message);
      socket?.emit(
        "lead-unshared",
        selectedUserId,
        user?.name,
        leadId,
        updatedLead.success
      );
      setSelectedUserId(undefined);
      onClose();
    } else toast.error(updatedLead.error);
    setLoading(false);
  };

  return (
    <div>
      {sharedUser && (
        <div>
          <h4 className="text-md text-muted-foreground font-bold">
            Currently Sharing Lead with:
          </h4>
          <p className="font-bold text-lg  text-center">
            {sharedUser.firstName} {sharedUser.lastName}
            <Button className="ms-2" size="sm" onClick={onUnShareLead}>
              <X size={16} />
            </Button>
          </p>
        </div>
      )}
      <p className="text-md text-muted-foreground font-bold">
        Select {sharedUser ? "a new" : "an"} agent
      </p>

      <UserSelect userId={selectedUserId} setUserId={setSelectedUserId} />

      <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
        <Button onClick={onClose} type="button" variant="outline">
          Cancel
        </Button>
        <Button
          disabled={loading || sharedUser?.id == selectedUserId}
          onClick={onShareLead}
        >
          Share
        </Button>
      </div>
    </div>
  );
};
