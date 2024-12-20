"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, MoreHorizontal, Phone, ShieldMinus } from "lucide-react";

import { PhoneNumber } from "@prisma/client";
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
  activatePhoneNumber,
  deactivatePhoneNumber,
  updatePhoneNumberDefault,
} from "@/actions/user/phone-number";

type Props = {
  data: PhoneNumber;
};
export const CellAction = ({ data }: Props) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Phone number copied to the clipboard");
  };

  const onActivate = async () => {
    setLoading(true);
    activatePhoneNumber(data.id).then((data) => {
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
    deactivatePhoneNumber(data.id).then((data) => {
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
    updatePhoneNumberDefault(data.id).then((data) => {
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
          <Button variant="ghost" className="h-8 w-8 gap-2 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem className="gap-2" onClick={onCopy}>
            <Copy size={16} />
            Copy number
          </DropdownMenuItem>

          {data.status != "Default" && data.status != "Inactive" && (
            <DropdownMenuItem className="gap-2" onClick={onSetDefault}>
              <Phone size={16} />
              Set default
            </DropdownMenuItem>
          )}
          {data.status === "Inactive" ? (
            <DropdownMenuItem className="gap-2" onClick={onActivate}>
              <ShieldMinus size={16} />
              Activate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="gap-2"
              onClick={() => setAlertOpen(true)}
            >
              <ShieldMinus size={16} />
              Deactivate
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
