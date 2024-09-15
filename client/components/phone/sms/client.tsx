import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { userEmitter } from "@/lib/event-emmiter";
import axios from "axios";

import { LeadMessage } from "@prisma/client";

import { PhoneSwitcher } from "../addins/switcher";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhone } from "@/hooks/use-phone";
import { formatPhoneNumber } from "@/formulas/phones";

import { SmsBody } from "./body";
import { SmsForm } from "./form";
import Loader from "@/components/reusable/loader";
import { Button } from "@/components/ui/button";
import { useLeadData } from "@/hooks/lead/use-lead";
import FormInput from "./form-input";

export const SmsClient = ({
  leadId,
  showHeader = true,
}: {
  leadId?: string;
  showHeader?: boolean;
}) => {
  const user = useCurrentUser();
  const { leadBasic } = useLeadData();
  const { isLeadInfoOpen, onLeadInfoToggle } = usePhone();

  let leadFullName = `${leadBasic?.firstName} ${leadBasic?.lastName}`;
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // PHONE VARIABLES
  const [to, setTo] = useState<{ name: string; number: string }>({
    name: leadBasic ? leadFullName : "New Sms",
    number: formatPhoneNumber(leadBasic?.cellPhone as string) || "",
  });

  const [selectedNumber, setSelectedNumber] = useState(
    user?.phoneNumbers.find((e) => e.phone == leadBasic?.defaultNumber)
      ?.phone ||
      user?.phoneNumbers[0]?.phone ||
      ""
  );

  const onNumberTyped = (num: string) => {
    setTo((state) => {
      return { ...state, number: num };
    });
    if (num.length > 9) {
      console.log("fetchinglead");
    }
    setDisabled(num.length > 9 ? true : false);
  };

  const onReset = () => {
    setTo({ name: "", number: "" });
    setDisabled(false);
  };

  useEffect(() => {
    if (!leadBasic) return;
    leadFullName = leadBasic
      ? `${leadBasic?.firstName} ${leadBasic?.lastName}`
      : "New Call";
    setTo({
      name: leadFullName,
      number: formatPhoneNumber(leadBasic?.cellPhone as string) || "",
    });
  }, [leadBasic]);

  // useEffect(() => {
  //   const setData = async () => {
  //     setLoading(true);
  //     if (lid) {
  //       const response = await axios.post("/api/leads/messages", {
  //         leadId: lid,
  //       });
  //       setMessages(response.data);
  //     }
  //     setLoading(false);
  //   };
  //   setData();
  // return () => setData();
  //}, [lid]);

  return (
    <div className="flex flex-col flex-1 gap-2 p-2 h-full overflow-hidden">
      {showHeader && (
        <>
          <div className="flex justify-between items-center">
            {to.name}
            {leadBasic && (
              <Button
                variant={isLeadInfoOpen ? "default" : "outlineprimary"}
                size="sm"
                onClick={onLeadInfoToggle}
              >
                LEAD INFO
              </Button>
            )}

            {/* {initialConvo && <Switch checked={initialConvo.autoChat} />} */}
          </div>
          <div className="relative">
            <Input
              placeholder="Phone Number"
              disabled={disabled}
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
      <SmsBody />
      {/* <SmsForm /> */}
      <FormInput placeholder="Write Something" />
    </div>
  );
};
