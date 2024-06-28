"use client";
import React, { useEffect, useState } from "react";

import axios from "axios";

import { User } from "@prisma/client";
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
};

export const UserSelect = ({ userId, setUserId }: UserSelectProps) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>();
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
    <>
      {loading ? (
        <Loader text="Loading Users..." />
      ) : (
        <Select
          name="ddlUsers"
          disabled={loading}
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
