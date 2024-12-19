"use client";

import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useNotificationStore } from "@/stores/notification-store";

import { NotificationReference } from "@/types/notification";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { closeOpenAppointments } from "@/actions/appointment";
import { createNotification } from "@/actions/notification";
import { remindTodos } from "@/actions/user/todo";
import { createConversationForCalls } from "@/actions/call";
import { toast } from "sonner";

const AdminTestMenu = () => {
  const user = useCurrentUser();
  const { onNotificationOpen } = useNotificationStore();
  const onCreateNewNotification = async () => {
    createNotification({
      title: "Missed Appointment",
      reference: NotificationReference.APPOINTMENT,
      content: "Hey, There is notification waiting for you",
      userId: user?.id as string,
      link: "/appointments/clvimkggz000m12rp8s92z54n",
      linkText: "View Appointment",
      read: false,
    });
  };
  const onCreateCallConversations = async () => {
    const conversationsCreated = await createConversationForCalls();
    if (conversationsCreated.success)
      toast.success(conversationsCreated.success);
    else toast.success(conversationsCreated.error);
  };
  if (user?.role != "DEVELOPER") return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Test Menu
          <ChevronDown size={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuLabel className="text-primary">
          Admin Test Menu
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => remindTodos(true)}>
          Reminders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => closeOpenAppointments(true)}>
          Close appointments
        </DropdownMenuItem>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onNotificationOpen("cm46bkupq0000uj0sz7p2uo4k")}
        >
          Open Notifications
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCreateNewNotification}>
          Create Notification
        </DropdownMenuItem>
        <DropdownMenuLabel>Call Conversations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onCreateCallConversations()}>
          Create Call Conversations
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminTestMenu;
