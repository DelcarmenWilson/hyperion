"use client";
import React, { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { AudioPlayer } from "@/components/custom/audio-player";
import { Button } from "@/components/ui/button";
import { callUpdateByIdShare } from "@/actions/call";
import { toast } from "sonner";

type CallHistoryActionsProps = {
  id: string;
  userId: string;
  shared: boolean;
  recordUrl: string;
};

export const CallHistoryActions = ({
  id,
  userId,
  shared,
  recordUrl,
}: CallHistoryActionsProps) => {
  const user = useCurrentUser();
  const [isShared, setIsShared] = useState(shared);
  if (!user) return null;
  const show: boolean = user.id == userId || user?.role == "MASTER";

  const OnShareToggle = () => {
    const localShared = !isShared;
    setIsShared(localShared);
    callUpdateByIdShare(id, localShared).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
  };
  if (!show) return null;
  return (
    <div>
      {recordUrl && (
        <div className="flex flex-col gap-1 items-start justify-center">
          <AudioPlayer src={recordUrl} />
          <Button variant="link" className="p-0" onClick={OnShareToggle}>
            {isShared ? "Unshare" : "Share"}
          </Button>
        </div>
      )}
    </div>
  );
};
