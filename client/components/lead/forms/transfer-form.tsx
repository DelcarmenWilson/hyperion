"use client";
import React, { useContext, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import SocketContext from "@/providers/socket";
import { userEmitter } from "@/lib/event-emmiter";

import axios from "axios";
import { toast } from "sonner";

import { User } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Loader from "@/components/reusable/loader";
import { leadUpdateByIdTransfer } from "@/actions/lead";

type ShareFormProps = {
  leadId: string;
  onClose: () => void;
};
export const TransferForm = ({ leadId, onClose }: ShareFormProps) => {
  const { socket } = useContext(SocketContext).SocketState;
  const user = useCurrentUser();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>();

  const onTransferLead = async () => {
    const transferedLead = await leadUpdateByIdTransfer(leadId, selectedUserId);
    if (transferedLead.success) {
      toast.success(transferedLead.success);
      socket?.emit(
        "lead-transfered",
        selectedUserId,
        user?.name,
        leadId,
        transferedLead.success
      );
      userEmitter.emit("leadTransfered", leadId);
      onClose();
    } else toast.error(transferedLead.error);
  };
  //TODO - see if we can put this in a use hook

  useEffect(() => {
    axios
      .post("/api/user/users", { role: "all" })
      .then((response) => {
        const data = response.data as User[];
        setUsers(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div>
      {loading ? (
        <Loader text="Loading Users..." />
      ) : (
        <>
          <p className="text-md text-muted-foreground font-bold">
            Select a agent to transfer the lead to
          </p>
          <Select
            name="ddlUsers"
            disabled={loading}
            onValueChange={setSelectedUserId}
            defaultValue={selectedUserId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a User" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button
              disabled={loading || !selectedUserId}
              onClick={onTransferLead}
            >
              Transfer
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
