"use client";
import React, { useState } from "react";
import { Users } from "lucide-react";

import { getEnumValues } from "@/lib/helper/enum-converter";
import { UserRoles } from "@/types/user";

import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  defaultValue: string;
  onChange: (role: string) => void;
};

const UpdateRoleDialog = ({ defaultValue, onChange }: Props) => {
  const [role, setRole] = useState(defaultValue);
  const userRoles = getEnumValues(UserRoles);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="opacity-0 group-hover:opacity-100">
          <span className="sr-only">Update Team</span>
          <span>Update</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader icon={Users} title="Update Role" />
        <div>
          <p className="text-muted-foreground">Select a Role</p>
          <p>{defaultValue}</p>

          <Select
            name="ddlTeam"
            onValueChange={setRole}
            defaultValue={defaultValue}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Role" />
            </SelectTrigger>
            <SelectContent>
              {userRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button disabled={defaultValue == role} onClick={() => onChange(role)}>
          Change
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRoleDialog;
