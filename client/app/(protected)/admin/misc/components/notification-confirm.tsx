"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { adminConfirmUserEmail } from "@/actions/admin";
import { Heading } from "@/components/custom/heading";
import { HalfUser } from "@/types";
import { notificationSettingsInsertAll } from "@/actions/notification-settings";

export const NotificationConfirm = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    notificationSettingsInsertAll().then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
  };
  return (
    <div>
      <Heading
        title="Notifications"
        description="Insert User Notification Settings"
      />
      <div className="flex-center gap-2">
        <Button onClick={onSubmit}>Create Notification Settings</Button>
      </div>
    </div>
  );
};
