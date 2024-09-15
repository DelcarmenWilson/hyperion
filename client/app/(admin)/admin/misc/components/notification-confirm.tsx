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

import { adminConfirmUserEmail } from "@/actions/admin/user";
import { Heading } from "@/components/custom/heading";
import { HalfUser } from "@/types";
import { notificationSettingsInsertAll } from "@/actions/settings/notification";

export const NotificationConfirm = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const insertedSettings = await notificationSettingsInsertAll();
    if (insertedSettings.success) toast.success(insertedSettings.success);
    else toast.error(insertedSettings.error);
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
