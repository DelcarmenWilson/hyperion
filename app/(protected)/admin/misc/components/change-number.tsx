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

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "@prisma/client";
import { adminChangeLeadDefaultNumber } from "@/actions/admin";
import { toast } from "sonner";
import { Heading } from "@/components/custom/heading";

type NumberChangeProps = {
  users: User[];
};
export const NumberChange = ({ users }: NumberChangeProps) => {
  const [loading, setLoading] = useState(false);
  const [selecteUser, setSelecteUser] = useState(users[0].id);
  const [oldPhone, setOldPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const onSubmit = () => {
    if (!selecteUser || !oldPhone || !newPhone) {
      toast.error("Invalid Data");
    }
    adminChangeLeadDefaultNumber(selecteUser, oldPhone, newPhone).then(
      (data) => {
        toast.success(data.success);
      }
    );
  };
  return (
    <div>
      <Heading
        title={`Change Number`}
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

      <p>Old Phone Number</p>
      <Input
        defaultValue={oldPhone}
        onChange={(e) => setOldPhone(e.target.value)}
      />
      <p>New Phone Number</p>

      <Input
        defaultValue={newPhone}
        onChange={(e) => setNewPhone(e.target.value)}
      />
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};
