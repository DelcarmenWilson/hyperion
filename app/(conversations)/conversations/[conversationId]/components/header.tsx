"use client";
import { useState } from "react";
import axios from "axios";

import { FullConversationType } from "@/types";
import { ProfileDrawer } from "./profile-drawer";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash } from "lucide-react";

interface HeaderProps {
  data: FullConversationType;
}
export const Header = ({ data }: HeaderProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const initials = `${data.lead.firstName.substring(
    0,
    1
  )} ${data.lead.lastName.substring(0, 1)}`;
  const fullName = `${data.lead.firstName} ${data.lead.lastName}`;

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/conversations/${data.id}`);
      router.refresh();
      router.push("/conversations");
      toast.success("Conversation deleted.");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setAlertOpen(true);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <ProfileDrawer
        data={data}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="flex justify-between items-center border-b h-14 px-2">
        <div className="flex justify-center items-center bg-primary text-accent  rounded-full p-1 mr-2">
          <span className="text-lg font-semibold">
            <span>{initials}</span>
          </span>
        </div>
        <div className="flex-1">
          <div className="text-lg">{fullName}</div>
        </div>
        <div>
          <Button variant="destructive" onClick={() => setAlertOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </>
  );
};
