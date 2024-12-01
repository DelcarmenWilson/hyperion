"use client";
import React from "react";

import { useUserData } from "@/hooks/user/use-user";

import { UserRole } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/reusable/loader";

type UserSelectProps = {
  userId: string | undefined;
  setUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
  disabled?: boolean;
  role?: UserRole;
};

export const UserSelect = ({
  userId,
  setUserId,
  disabled = false,
  role,
}: UserSelectProps) => {
  const { onGetSiteUsers } = useUserData();
  const { siteUsers, siteUsersFetching } = onGetSiteUsers(role);

  return (
    <>
      {siteUsersFetching ? (
        <Loader text="Loading Users..." />
      ) : (
        <Select
          name="ddlUsers"
          disabled={siteUsersFetching || disabled}
          onValueChange={setUserId}
          defaultValue={userId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {siteUsers?.map((user) => (
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
