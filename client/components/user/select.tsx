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
import SkeletonWrapper from "../skeleton-wrapper";

type UserSelectProps = {
  userId: string | undefined;
  setUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
  disabled?: boolean;
  role?: UserRole;
  unassigned?: boolean;
};
export const UserSelect = ({
  userId,
  setUserId,
  disabled = false,
  unassigned = false,
}: UserSelectProps) => {
  const { onGetUsers } = useUserData();
  const { users, usersFetching } = onGetUsers();

  return (
    <SkeletonWrapper isLoading={usersFetching}>
      <Select
        name="ddlUsers"
        disabled={usersFetching || disabled}
        onValueChange={setUserId}
        defaultValue={userId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an agent" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {unassigned && (
            <SelectItem value="unassigned">LEAVE UNASSIGNED</SelectItem>
          )}
          {users?.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SkeletonWrapper>
  );
};
export const OtherUserSelect = ({
  userId,
  setUserId,
  disabled = false,
  role,
  unassigned = false,
}: UserSelectProps) => {
  const { onGetSiteUsers } = useUserData();
  const { siteUsers, siteUsersFetching } = onGetSiteUsers(role);

  return (
    <SkeletonWrapper isLoading={siteUsersFetching}>
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
          {unassigned && (
            <SelectItem value="unassigned">LEAVE UNASSIGNED</SelectItem>
          )}
          {siteUsers?.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SkeletonWrapper>
  );
};
