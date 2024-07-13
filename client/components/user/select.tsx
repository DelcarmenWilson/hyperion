"use client";
import React from "react";

import { UserRole } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/reusable/loader";
import { useUserData } from "@/hooks/use-user";

type UserSelectProps = {
  userId: string | undefined;
  setUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
  role?: UserRole;
};

export const UserSelect = ({ userId, setUserId, role }: UserSelectProps) => {
  const { users, isUserFetching } = useUserData(role);

  return (
    <>
      {isUserFetching ? (
        <Loader text="Loading Users..." />
      ) : (
        <Select
          name="ddlUsers"
          disabled={isUserFetching}
          onValueChange={setUserId}
          defaultValue={userId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
};
