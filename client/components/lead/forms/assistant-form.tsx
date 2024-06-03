"use client";
import React, { useEffect, useState } from "react";

import axios from "axios";

import { useQuery } from "@tanstack/react-query";
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
import { leadUpdateByIdAsssitant } from "@/actions/lead";

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
  const [assistantId, setAssistantId] = useState(assistant?.id);
  const [loading, setLoading] = useState(false);

  const assistantsQuery = useQuery<User[]>({
    queryKey: ["userAsisstants"],
    queryFn: () =>
      fetch("/api/user/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: "ASSISTANT" }),
      }).then((res) => res.json()),
  });

  const onSetAssistant = async (userId: string | undefined = undefined) => {
    setLoading(true);
    const leadShared = await leadUpdateByIdAsssitant(leadId, userId);
    if (leadShared.success) {
      toast.success(leadShared.success);
      onClose();
    } else toast.error(leadShared.error);
    setLoading(false);
  };
  //TODO - need to change this to useQuery

  // useEffect(() => {
  //   axios
  //     .post("/api/user/users", { role: "ASSISTANT" })
  //     .then((response) => {
  //       const data = response.data as User[];
  //       setUsers(data);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);
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
                    setAssistantId(undefined);
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
            disabled={assistantsQuery.isPending}
            onValueChange={setAssistantId}
            defaultValue={assistantId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a User" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {assistantsQuery.data?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {assistant?.id !== assistantId && (
            <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
              <Button onClick={onClose} type="button" variant="outline">
                Cancel
              </Button>
              <Button
                disabled={loading}
                onClick={() => onSetAssistant(assistantId)}
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
