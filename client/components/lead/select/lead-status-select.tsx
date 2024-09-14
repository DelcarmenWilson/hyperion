"use client";
import React from "react";
import { useGlobalContext } from "@/providers/global";
import { userEmitter } from "@/lib/event-emmiter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { leadUpdateByIdStatus } from "@/actions/lead/status";
import { toast } from "sonner";

type Props = {
  id: string;
  status: string;
  onSetStatus?: (c: "status", e: string) => void;
};

export const LeadStatusSelect = ({ id, status, onSetStatus }: Props) => {
  const { leadStatus } = useGlobalContext();

  const onStatusUpdated = async (newStatus: string) => {
    if (newStatus == status) return;
    const reponse = await leadUpdateByIdStatus(id, newStatus);
    if (reponse.success) {
      userEmitter.emit("leadStatusChanged", id, newStatus);
      toast.success(reponse.success);
    } else toast.error(reponse.error);
  };

  return (
    <Select
      name="ddlLeadStatus"
      disabled={status == "Do_Not_Call"}
      onValueChange={(e) =>
        onSetStatus ? onSetStatus("status", e) : onStatusUpdated(e)
      }
      defaultValue={status}
    >
      <SelectTrigger>
        <SelectValue placeholder="Lead Status" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {onSetStatus && <SelectItem value="%">All</SelectItem>}
        {leadStatus?.map((status) => (
          <SelectItem key={status.id} value={status.status}>
            {status.status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
