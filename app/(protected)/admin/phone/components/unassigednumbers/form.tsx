"use client";

import { phoneNumberUpdateByIdAssign } from "@/actions/phone";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatPhoneNumber } from "@/formulas/phones";
import { PhoneNumber, User } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AssignNumberFormProps = {
  phoneNumber: PhoneNumber;
};
export const AssignNumberForm = ({ phoneNumber }: AssignNumberFormProps) => {
  const router = useRouter();
  const [users, setUsers] = useState<User[] | null>(null);
  const [selectedUser, setSelectedUser] = useState(phoneNumber.agentId || "");

  const onAssignNumber = () => {
    if (!selectedUser || selectedUser == phoneNumber.agentId) return;
    phoneNumberUpdateByIdAssign(phoneNumber.id, selectedUser).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        router.refresh();
      }
    });
  };

  useEffect(() => {
    axios.post("/api/user/users").then((response) => {
      if (response.data) {
        setUsers(response.data);
      }
    });
  }, []);
  return (
    <div className="w-full flex flex-col gap-2 p-2">
      <h2 className="text-2xl border-b">Assign Phone Number</h2>
      <h3 className="font-semibold text-primary text-2xl italic text-center">
        {formatPhoneNumber(phoneNumber.phone)}
      </h3>
      <div className="grid grid-cols-3 text-sm">
        <div>
          <p className="font-semibold">State</p>
          <span>{phoneNumber.state}</span>
        </div>
        <div>
          <p className="font-semibold">Created At</p>
          <span>{format(phoneNumber.createdAt, "MM-dd-yy")}</span>
        </div>
        <div>
          <p className="font-semibold">Renew At</p>
          <span>{format(phoneNumber.renewAt, "MM-dd-yy")}</span>
        </div>
      </div>
      <div className="flex gap-2 text-sm my-2">
        <Select
          name="ddlUser"
          //   disabled={loading}
          onValueChange={(e) => setSelectedUser(e)}
          defaultValue={selectedUser}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a User" />
          </SelectTrigger>
          <SelectContent>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedUser && selectedUser != phoneNumber.agentId && (
          <div className="text-end">
            <Button className="w-fit" onClick={onAssignNumber}>
              Assign Number
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
