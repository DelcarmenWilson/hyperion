"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { User } from "@prisma/client";
import { adminUpdateLeadNumbers } from "@/actions/admin";
import { toast } from "sonner";
import { Heading } from "@/components/custom/heading";

type PhoneUpdateProps = {
  users: User[];
};
export const PhoneUpdate = ({ users }: PhoneUpdateProps) => {
  const [loading, setLoading] = useState(false);
  const [selecteUser, setSelecteUser] = useState(users[0].id);

  const onSubmit = () => {
    if (!selecteUser) {
      toast.error("Please slect a user");
    }
    adminUpdateLeadNumbers(selecteUser).then((data) => {
      toast.success(data.success);
    });
  };
  return (
    <div>
      <Heading
        title={`Phone Update`}
        description="Change user specific number"
      />
      <p>User</p>
      <Select
        name="ddlUser"
        disabled={loading}
        onValueChange={(e) => setSelecteUser(e)}
        defaultValue={selecteUser}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a User" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.userName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};
