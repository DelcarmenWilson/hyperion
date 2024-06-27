import React from "react";
import { Phone, PhoneForwarded, PhoneOff } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notificationsUpdateByIdMasterSwitch } from "@/actions/notification-settings";

export const MasterSwitch = () => {
  const user = useCurrentUser();

  const onMasterSwitchChange = async (master: string) => {
    const updatedNotification = await notificationsUpdateByIdMasterSwitch(
      master
    );
    if (updatedNotification.success) toast.success(updatedNotification.success);
    else toast.error(updatedNotification.error);
  };
  return (
    <Select
      name="ddlMaster"
      onValueChange={onMasterSwitchChange}
      defaultValue={user?.masterSwitch}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="on">
          <div className="flex items-center gap-2 w-full">
            <Phone size={16} /> ON
          </div>
        </SelectItem>
        <SelectItem value="off">
          <div className="flex items-center gap-2 w-full">
            <PhoneOff size={16} /> OFF
          </div>
        </SelectItem>
        <SelectItem value="call-forward" disabled={!user?.personalNumber}>
          <div className="flex items-center gap-2 w-full">
            <PhoneForwarded size={16} /> Call Forward
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
