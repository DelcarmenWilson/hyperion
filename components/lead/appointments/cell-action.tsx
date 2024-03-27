"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Eye, MoreHorizontal, Trash } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert";
import { FullAppointment } from "@/types";
import { DrawerRight } from "@/components/custom/drawer-right";
import { CopyButton } from "@/components/reusable/copy-button";
import { AppointmentForm } from "./form";

interface CellActionProps {
  data: FullAppointment;
}
export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const user = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onDelete = async () => {
    // try {
    //   setLoading(true);
    //   await axios.delete(`/api/leads/${data.id}`);
    //   router.refresh();
    //   toast.success("Lead deleted.");
    // } catch (error) {
    //   toast.error("Something went wrong!");
    // } finally {
    //   setLoading(false);
    //   setAlertOpen(false);
    // }
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DrawerRight
        title={"Appointment"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <AppointmentForm
          appointment={data}
          onClose={() => setIsDrawerOpen(false)}
        />
      </DrawerRight>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem>
            Copy Id
            <CopyButton value={data.id} message="Appointment Id" />
          </DropdownMenuItem>

          {/* <DropdownMenuItem onClick={() => setIsDrawerOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAlertOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
