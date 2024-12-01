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

const AdminTestMenu = () => {
  const role = useCurrentRole();
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
        <DropdownMenuItem onSelect={() => closeOpenAppointments(true)}>
          Close appointments
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminTestMenu;
