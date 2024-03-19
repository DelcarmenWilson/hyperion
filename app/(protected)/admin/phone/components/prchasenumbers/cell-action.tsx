"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, MoreHorizontal, Phone, ShieldMinus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { AlertModal } from "@/components/modals/alert";
import {
  phoneNumberUpdateByIdActivate,
  phoneNumberUpdateByIdDeactivate,
  phoneNumberUpdateByIdDefault,
} from "@/actions/phone";
import { PhoneNumber } from "@prisma/client";

interface CellActionProps {
  data: PhoneNumber;
}
export const CellAction = ({ data }: CellActionProps) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Phone number copied to the clipboard");
  };

  const onActivate = async () => {
    setLoading(true);
    phoneNumberUpdateByIdActivate(data.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });

    setLoading(false);
    setAlertOpen(false);
  };
  const onDeactivate = async () => {
    setLoading(true);
    phoneNumberUpdateByIdDeactivate(data.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
    setLoading(false);
    setAlertOpen(false);
  };

  const onSetDefault = () => {
    setLoading(true);
    phoneNumberUpdateByIdDefault(data.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
    setLoading(false);
    setAlertOpen(false);
  };
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeactivate}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={onCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy number
          </DropdownMenuItem>

          {data.status != "Default" && data.status != "Inactive" && (
            <DropdownMenuItem onClick={onSetDefault}>
              <Phone className="mr-2 h-4 w-4" />
              Set default
            </DropdownMenuItem>
          )}
          {data.status === "Inactive" ? (
            <DropdownMenuItem onClick={onActivate}>
              <ShieldMinus className="mr-2 h-4 w-4" />
              Activate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setAlertOpen(true)}>
              <ShieldMinus className="mr-2 h-4 w-4" />
              Deactivate
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
