"use client";
import React from "react";
import { useLeadStore, useLeadActions } from "@/hooks/lead/use-lead";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { UserSelect } from "@/components/user/select";

export const AssistantForm = () => {
  const {
    userId,
    setUserId,
    loading,
    isAssistantFormOpen,
    onAssistantFormClose,
    leadIds,
    leadFullName,
    initUser: assistant,
    onLeadUpdateByIdAssistantAdd,
    onLeadUpdateByIdAssistantRemove,
  } = useLeadActions();

  return (
    <Dialog open={isAssistantFormOpen} onOpenChange={onAssistantFormClose}>
      <DialogDescription className="hidden">Assistant Form</DialogDescription>
      <DialogContent className="flex flex-col justify-start h-auto max-w-screen-sm">
        <h3 className="text-2xl font-semibold py-2">
          Assistant for - <span className="text-primary">{leadFullName}</span>
        </h3>
        {assistant && (
          <div>
            <h4 className="text-md text-muted-foreground font-bold">
              Current Assistant:
            </h4>
            <p className="font-bold text-lg  text-center">
              {assistant.firstName} {assistant.lastName}
              <Button
                className="ms-2"
                size="sm"
                onClick={onLeadUpdateByIdAssistantRemove}
              >
                <X size={16} />
              </Button>
            </p>
          </div>
        )}
        <p className="text-md text-muted-foreground font-bold">
          Select a {assistant && "new"} assistant
        </p>
        <UserSelect role="ASSISTANT" userId={userId} setUserId={setUserId} />
        {assistant?.id !== userId && (
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button
              onClick={onAssistantFormClose}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={loading} onClick={onLeadUpdateByIdAssistantAdd}>
              Add
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
