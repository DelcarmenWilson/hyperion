import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { userEmitter } from "@/lib/event-emmiter";

import { LeadMessage } from "@prisma/client";
import { Switch } from "@/components/ui/switch";

import { PhoneSwitcher } from "../addins/switcher";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhone } from "@/hooks/use-phone";
import { formatPhoneNumber } from "@/formulas/phones";

import { SmsBody } from "./body";
import { SmsForm } from "./form";
import axios from "axios";
import Loader from "@/components/reusable/loader";
import { Button } from "@/components/ui/button";

export const SmsClient = ({
  leadId,
  showHeader = true,
}: {
  leadId?: string;
  showHeader?: boolean;
}) => {
  const user = useCurrentUser();
  const { lead } = usePhone();
  const lid = leadId || lead?.id;
  const leadFullName = `${lead?.firstName} ${lead?.lastName}`;
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // PHONE VARIABLES
  const [to, setTo] = useState<{ name: string; number: string }>({
    name: lead ? leadFullName : "New Sms",
    number: formatPhoneNumber(lead?.cellPhone as string) || "",
  });

  const [selectedNumber, setSelectedNumber] = useState(
    user?.phoneNumbers.find((e) => e.phone == lead?.defaultNumber)?.phone ||
      user?.phoneNumbers[0]?.phone ||
      ""
  );

  const onNumberTyped = (num: string) => {
    setTo((state) => {
      return { ...state, number: num };
    });
    setDisabled(num.length > 9 ? true : false);
  };

  const onReset = () => {
    setTo({ name: "", number: "" });
    setDisabled(false);
  };

  useEffect(() => {
    const setData = async () => {
      setLoading(true);
      if (lid) {
        const response = await axios.post("/api/leads/messages", {
          leadId: lid,
        });
        setMessages(response.data);
      }
      setLoading(false);
    };
    setData();
    // return () => setData();
  }, [lid]);

  return (
    <div className="flex flex-col flex-1 gap-2 p-2 h-full overflow-hidden">
      {showHeader && (
        <>
          <div className="flex justify-between items-center">
            {to.name}
            {lead && (
              <Button
                variant="outlineprimary"
                size="sm"
                onClick={() =>
                  setIsOpen((open) => {
                    userEmitter.emit("toggleLeadInfo", !open);
                    return !open;
                  })
                }
              >
                LEAD INFO
              </Button>
            )}

            {/* {initialConvo && <Switch checked={initialConvo.autoChat} />} */}
          </div>
          <div className="relative">
            <Input
              placeholder="Phone Number"
              value={to.number}
              maxLength={10}
              onChange={(e) => onNumberTyped(e.target.value)}
            />
            <X
              className={cn(
                "h-4 w-4 absolute right-2 top-0 translate-y-1/2 cursor-pointer transition-opacity ease-in-out",
                to.number.length == 0 ? "opacity-0" : "opacity-100"
              )}
              onClick={onReset}
            />
          </div>
        </>
      )}
      <div className="flex justify-between items-center">
        <span className="w-40">Caller Id</span>
        <PhoneSwitcher
          number={selectedNumber}
          onSetDefaultNumber={setSelectedNumber}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <SmsBody
          leadName={lead?.lastName as string}
          userName={user?.name as string}
        />
      )}
      <SmsForm lead={lead} />
    </div>
  );
};
