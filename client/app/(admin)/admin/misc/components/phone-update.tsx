"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { adminUpdateLeadNumbers } from "@/actions/admin/lead";
import { adminUpdateUserNumber } from "@/actions/admin/user";
import { Heading } from "@/components/custom/heading";
import { HalfUser } from "@/types";

type PhoneUpdateProps = {
  users: HalfUser[];
};
export const PhoneUpdate = ({ users }: PhoneUpdateProps) => {
  const [loading, setLoading] = useState(false);
  const [selecteUser, setSelecteUser] = useState(users[0].id);

  const onLeadNumbersUpdate = () => {
    if (!selecteUser) {
      toast.error("Please slect a user");
    }
    setLoading(true);
    adminUpdateLeadNumbers(selecteUser).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
    setLoading(false);
  };
  const onUserNumberUpdate = () => {
    if (!selecteUser) {
      toast.error("Please slect a user");
    }
    setLoading(true);
    adminUpdateUserNumber(selecteUser).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
    setLoading(false);
  };

  return (
    <div>
      <Heading
        title={`Phone Update`}
        description="Change user specific number"
      />
      <div className="flex flex-col gap-2">
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
        <div className="flex gap-2">
          <Button disabled={loading} onClick={onLeadNumbersUpdate}>
            Lead Number Update
          </Button>
          <Button disabled={loading} onClick={onUserNumberUpdate}>
            User Number Update
          </Button>
        </div>
      </div>
    </div>
  );
};
