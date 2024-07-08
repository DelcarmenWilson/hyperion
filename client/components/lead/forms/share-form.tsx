"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

import { useLead, useLeadActions } from "@/hooks/use-lead";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { UserSelect } from "@/components/user/select";

export const ShareForm = () => {
  const {
    isShareFormOpen,
    onShareFormClose,
    leadId,
    leadFullName,
    sharedUser,
  } = useLead();
  const { onLeadUpdateByIdShare, onLeadUpdateByIdUnShare } = useLeadActions();

  const [selectedUserId, setSelectedUserId] = useState(sharedUser?.id);
  const [loading, setLoading] = useState(false);

  const onShareLead = async () => {
    setLoading(true);
    const updatedLead = await onLeadUpdateByIdShare(leadId, selectedUserId);
    if (updatedLead) onShareFormClose();
    setLoading(false);
  };
  const onUnShareLead = async () => {
    setLoading(true);
    const updatedLead = await onLeadUpdateByIdUnShare(leadId);
    if (updatedLead) {
      setSelectedUserId(undefined);
      onShareFormClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={isShareFormOpen} onOpenChange={onShareFormClose}>
      <DialogContent className="flex flex-col justify-start h-auto max-w-screen-sm">
        <h3 className="text-2xl font-semibold py-2">
          Share Lead - <span className="text-primary">{leadFullName}</span>
        </h3>
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
          <Button onClick={onShareFormClose} type="button" variant="outline">
            Cancel
          </Button>
          <Button
            disabled={loading || sharedUser?.id == selectedUserId}
            onClick={onShareLead}
          >
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
