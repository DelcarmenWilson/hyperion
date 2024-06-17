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

  const onMasterSwitchChange = (master: string) => {
    notificationsUpdateByIdMasterSwitch(master).then((data) => {
      if (data.success) toast.success(data.success);
      else toast.error(data.error);
    });
  };
  return (
    <div className="flex gap-2 items-center">
      <div className="flex items-center gap-2">
        <Phone size={16} /> Options
      </div>

      <Select
        name="ddlMaster"
        onValueChange={onMasterSwitchChange}
        defaultValue={user?.masterSwitch}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select State" />
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
    </div>
  );
};
