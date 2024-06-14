"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { PhoneNumber, User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatPhoneNumber } from "@/formulas/phones";
import { phoneNumberUpdateByIdAssign } from "@/actions/phonenumber";
import { formatDate } from "@/formulas/dates";

type AssignNumberFormProps = {
  phoneNumber: PhoneNumber;
};
//TODO - need to incoporate react query
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
    axios.post("/api/user/users", { role: "all" }).then((response) => {
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
        <TextGroup label="State" value={phoneNumber.state} />
        <TextGroup
          label="Created At"
          value={formatDate(phoneNumber.createdAt)}
        />
        <TextGroup label="Renew At" value={formatDate(phoneNumber.renewAt)} />
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

type TextGroupProps = {
  label: string;
  value: string;
};

const TextGroup = ({ label, value }: TextGroupProps) => {
  return (
    <div>
      <p className="font-semibold">{label}</p>
      <span>{value}</span>
    </div>
  );
};
