"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Info,
  LucideIcon,
  MessageSquare,
  MessageSquareText,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TwilioNumber } from "@/types";
import { OtherUserSelect } from "@/components/user/select";

import { formatPhoneNumber } from "@/formulas/phones";

const PurchasePhoneNumberDialog = ({
  phoneNumber,
}: {
  phoneNumber: TwilioNumber;
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | undefined>("");
  const { voice, SMS, MMS } = phoneNumber.capabilities;

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
          setOpen(false);
        }
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Details</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader icon={Phone} title="Purchase Phone" />
        <div className="w-full flex flex-col gap-2 p-2">
          <h2 className="text-2xl border-b">Purchase Phone Number</h2>
          <div className="flex justify-between items-center">
            <p className="font-semibold text-primary text-2xl italic">
              {formatPhoneNumber(phoneNumber.phoneNumber)}
            </p>
            <p className="text-muted-foreground">
              <span className="font-semibold">$1.15</span> month fee
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Info className="text-primary" size={25} />
            <span className="text-sm text-muted-foreground">
              You&apos;ll be charged $1.15 immediately. Afterwards, you&apos;ll
              be charged $1.15/month in addition to the usage you incur on the
              phone number.
            </span>
          </div>
          <div className="grid grid-cols-3 text-sm">
            <Box title="Country" value={phoneNumber.isoCountry} />
            <Box title="State" value={phoneNumber.region} />
            <Box title="Locality" value={phoneNumber.locality} />
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Capabilities</h4>
            <Capability
              icon={Phone}
              title="Voice"
              value="Receive incoming calls and make outgoing calls."
              show={voice}
            />
            <Capability
              icon={MessageSquare}
              title="SMS"
              value="Send and receive text messages."
              show={SMS}
            />
            <Capability
              icon={MessageSquareText}
              title="MMS"
              value="Send and receive multi-media messages."
              show={MMS}
            />
          </div>

          <div className="flex items-end justify-between">
            <div className="text-sm">
              <p className="font-semibold">Assign To</p>

              <OtherUserSelect
                userId={selectedUser}
                setUserId={setSelectedUser}
                unassigned
              />
            </div>

            {selectedUser && (
              <Button className="w-fit" onClick={onPurchaseNumber}>
                Purchase {phoneNumber.phoneNumber}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type Props = { title: string; value: string };
const Box = ({ title, value }: Props) => {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <span>{value}</span>
    </div>
  );
};
type CapabilityProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  show: boolean;
};
const Capability = ({ icon: Icon, title, value, show }: CapabilityProps) => {
  if (!show) return null;
  return (
    <div className="flex items-center gap-2">
      <Icon size={25} className="text-primary" />
      <div className="text-sm">
        <p className="font-semibold">{title}</p>
        <span className=" text-muted-foreground">{value}</span>
      </div>
    </div>
  );
};

export default PurchasePhoneNumberDialog;
