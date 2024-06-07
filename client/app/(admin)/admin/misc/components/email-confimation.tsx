"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { adminConfirmUserEmail } from "@/actions/admin/user";
import { Heading } from "@/components/custom/heading";
import { HalfUser } from "@/types";

type EmailConfirmProps = {
  users: HalfUser[];
};
export const EmailConfirm = ({ users }: EmailConfirmProps) => {
  const [loading, setLoading] = useState(false);
  const [selecteUser, setSelecteUser] = useState(users[0].id);
  const [date, setDate] = useState(new Date().toLocaleString());

  const onSubmit = () => {
    if (!selecteUser) {
      toast.error("Please slect a user");
    }
    if (!date) {
      toast.error("Please enter a date");
    }
    adminConfirmUserEmail(selecteUser, date).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
  };
  return (
    <div>
      <Heading title={`Email Confirm`} description="Confirm users email" />
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

        <p>date</p>
        <Input defaultValue={date} onChange={(e) => setDate(e.target.value)} />
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  );
};
