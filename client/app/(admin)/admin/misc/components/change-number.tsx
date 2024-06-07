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

import { adminChangeLeadDefaultNumber } from "@/actions/admin/lead";
import { Heading } from "@/components/custom/heading";
import { HalfUser } from "@/types";

type NumberChangeProps = {
  users: HalfUser[];
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
    </div>
  );
};
