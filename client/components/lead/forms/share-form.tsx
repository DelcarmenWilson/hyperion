"use client";
import React from "react";
import { X } from "lucide-react";

import { useLeadActions } from "@/hooks/lead/use-lead";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/global/custom-dialog";
import { UserSelect } from "@/components/user/select";

export const ShareForm = () => {
  const {
    loading,
    userId,
    leadFullName,
    initUser,
    leadIds,
    setUserId,
    isShareFormOpen,
    onShareFormClose,
    onLeadUpdateByIdShare,
    onLeadUpdateByIdUnShare,
  } = useLeadActions();

  return (
    <CustomDialog
      title="Share Lead"
      subTitle={leadFullName}
      description="Share Form"
      open={isShareFormOpen}
      onClose={onShareFormClose}
    >
      {initUser && (
        <div>
          <h4 className="text-md text-muted-foreground font-bold">
            Currently Sharing Lead with:
          </h4>
          {leadIds?.length && leadIds.length == 1 && (
            <p className="font-bold text-lg  text-center">
              {initUser.firstName} {initUser.lastName}
              <Button
                className="ms-2"
                size="sm"
                onClick={onLeadUpdateByIdUnShare}
              >
                <X size={16} />
              </Button>
            </p>
          )}
        </div>
      )}
      <p className="text-md text-muted-foreground font-bold">
        Select {initUser ? "a new" : "an"} agent
      </p>

      <UserSelect userId={userId} setUserId={setUserId} />

      <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
        <Button onClick={onShareFormClose} type="button" variant="outline">
          Cancel
        </Button>
        <Button
          disabled={loading || initUser?.id == userId}
          onClick={onLeadUpdateByIdShare}
        >
          Share
        </Button>
      </div>
    </CustomDialog>
  );
};
