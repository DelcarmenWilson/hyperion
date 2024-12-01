"use client";
import React, { useState } from "react";
import { Users } from "lucide-react";

import { getEnumValues } from "@/lib/helper/enum-converter";
import { UserAccountStatus } from "@/types/user";

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

const UpdateAccountStatusDialog = ({ defaultValue, onChange }: Props) => {
  const [status, setStatus] = useState(defaultValue);
  const userAccountStatus = getEnumValues(UserAccountStatus);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="opacity-0 group-hover:opacity-100">
          <span className="sr-only">Update Team</span>
          <span>Update</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader icon={Users} title="Update Account status" />
        <div>
          <p className="text-muted-foreground">Select a status</p>

          <Select
            name="ddlAccountStatus"
            onValueChange={setStatus}
            defaultValue={defaultValue}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {userAccountStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={defaultValue == status}
          onClick={() => onChange(status)}
        >
          Change
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAccountStatusDialog;
