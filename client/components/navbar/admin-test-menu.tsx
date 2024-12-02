"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { remindTodos } from "@/actions/user/todo";
import { closeOpenAppointments } from "@/actions/appointment";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { useCurrentRole } from "@/hooks/user/use-current";
import {
  useNotificationActions,
  useNotificationStore,
} from "@/hooks/notification/use-notification";
import { createNotification } from "@/actions/notification";
import { NotificationReference } from "@/types/notification";
import { toast } from "sonner";

const AdminTestMenu = () => {
  const role = useCurrentRole();
  const { onNotificationOpen } = useNotificationStore();
  const createNotifications = async () => {
    createNotification({
      title: "Missed Appointment",
      reference: NotificationReference.APPOINTMENT,
      content: "Hey, There is notification waiting for you",
      userId: "cm29d1zrb00048cbsq1237awk",
      link: "/appointments",
      linkText: "View appointments",
    });
    toast.success("Notification created successful")
  };
  if (role != "DEVELOPER") return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Test Menu
          <ChevronDown size={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Admin Test Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => remindTodos(true)}>
          Reminders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => closeOpenAppointments(true)}>
          Close appointments
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onNotificationOpen}>
          Open Notifications
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createNotifications}>
          Create Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminTestMenu;
