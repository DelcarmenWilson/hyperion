"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, MessageSquare, MessageSquareText, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatPhoneNumber } from "@/formulas/phones";
import { TwilioNumber } from "@/types/twilio";
import { User } from "@prisma/client";
import axios from "axios";

type PurchaseFormProps = {
  phoneNumber: TwilioNumber;
};
export const PurchaseForm = ({ phoneNumber }: PurchaseFormProps) => {
  const router = useRouter();
  const [users, setUsers] = useState<User[] | null>(null);
  const [selectedUser, setSelectedUser] = useState("");

  const onPurchaseNumber = () => {
    axios
      .post("/api/twilio/phonenumber/purchase", {
        phonenumber: phoneNumber.phoneNumber,
        state: phoneNumber.region,
        agentId: selectedUser,
      })
      .then((response) => {
        const data = response.data;
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
      <h2 className="text-2xl border-b">Purchase Phone Number</h2>
      <div className="flex justify-between items-center">
        <p className="font-semibold text-primary text-2xl italic">
          {formatPhoneNumber(phoneNumber.phoneNumber)}
        </p>
        <p>
          <span className="font-semibold">$1.15</span> month fee
        </p>
      </div>
      <div className="flex items-start gap-2">
        <Info className="text-primary" size={25} />
        <span className=" text-muted-foreground">
          You&apos;ll be charged $1.15 immediately. Afterwards, you&apos;ll be
          charged $1.15/month in addition to the usage you incur on the phone
          number.
        </span>
      </div>
      <div className="grid grid-cols-3 text-sm">
        <div>
          <p className="font-semibold">Country</p>
          <span>{phoneNumber.isoCountry}</span>
        </div>
        <div>
          <p className="font-semibold">State</p>
          <span>{phoneNumber.region}</span>
        </div>
        <div>
          <p className="font-semibold">Locality</p>
          <span>{phoneNumber.locality}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="font-semibold">Capabilities</h4>
        {phoneNumber.capabilities.voice && (
          <div className=" flex items-center gap-2">
            <Phone size={25} />
            <div>
              <p className="font-semibold">Voice</p>
              <span>Receive incoming calls and make outgoing calls.</span>
            </div>
          </div>
        )}
        {phoneNumber.capabilities.SMS && (
          <div className=" flex gap-2">
            <MessageSquare size={25} />
            <div>
              <p className="font-semibold">SMS</p>
              <span>Send and receive text messages.</span>
            </div>
          </div>
        )}
        {phoneNumber.capabilities.MMS && (
          <div className=" flex gap-2">
            <MessageSquareText size={25} />
            <div>
              <p className="font-semibold">MMS</p>
              <span>Send and receive multi-media messages.</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="text-sm">
          <p className="font-semibold">Assign To</p>
          <Select
            name="ddlUser"
            //   disabled={loading}
            onValueChange={(e) => setSelectedUser(e)}
            defaultValue={selectedUser}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Select a User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">LEAVE UNASSIGNED</SelectItem>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedUser && (
          <Button className="w-fit" onClick={onPurchaseNumber}>
            Purchase {phoneNumber.phoneNumber}
          </Button>
        )}
      </div>
    </div>
  );
};
