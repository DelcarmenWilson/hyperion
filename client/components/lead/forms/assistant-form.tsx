"use client";
import React, { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "sonner";
import { X } from "lucide-react";

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
import { leadUpdateByIdShare } from "@/actions/lead";

type AssistantFormProps = {
  leadId: string;
  assistant: User | null | undefined;
  onClose: () => void;
};
export const AssistantForm = ({
  leadId,
  assistant,
  onClose,
}: AssistantFormProps) => {
  const [selectedUserId, setSelectedUserId] = useState(assistant?.id);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>();

  const onSetAssistant = (userId: string | undefined = undefined) => {
    leadUpdateByIdShare(leadId, userId).then((data) => {
      if (data.success) {
        toast.success(data.success);
        onClose();
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
  };

  useEffect(() => {
    axios
      .post("/api/user/users", { role: "ASSISTANT" })
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
          {assistant && (
            <div>
              <h4 className="text-md text-muted-foreground font-bold">
                Current Assistant:
              </h4>
              <p className="font-bold text-lg  text-center">
                {assistant.firstName} {assistant.lastName}
                <Button
                  className="ms-2"
                  size="sm"
                  onClick={() => {
                    setSelectedUserId(undefined);
                    onSetAssistant();
                  }}
                >
                  <X size={16} />
                </Button>
              </p>
            </div>
          )}
          <p className="text-md text-muted-foreground font-bold">
            Select a {assistant && "new"} assistant
          </p>
          <Select
            name="ddlGender"
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

          {assistant?.id !== selectedUserId && (
            <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
              <Button onClick={onClose} type="button" variant="outline">
                Cancel
              </Button>
              <Button
                disabled={loading}
                onClick={() => onSetAssistant(selectedUserId)}
              >
                Share
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
