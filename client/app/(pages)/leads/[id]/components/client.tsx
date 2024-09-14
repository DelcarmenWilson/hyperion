"use client";
import { Pencil } from "lucide-react";
import { useLeadData, useLeadId, useLeadStore } from "@/hooks/lead/use-lead";

import { Button } from "@/components/ui/button";
import { GeneralInfoClient } from "@/components/lead/info/general";
import { PolicyInfoClient } from "@/components/lead/info/policy-info";
import { CallInfo } from "@/components/lead/info/call";
import { MainInfoClient } from "@/components/lead/info/main";
import { NotesForm } from "@/components/lead/forms/notes-form";

import { PhoneSwitcher } from "@/components/phone/addins/switcher";

import { formatPhoneNumber } from "@/formulas/phones";
import { useEffect } from "react";

export const LeadClient = () => {
  const { setLeadId } = useLeadStore();
  const { edit, setEdit, defaultNumber, onSetDefaultNumber } = useLeadData();
  const { leadId } = useLeadId();

  useEffect(() => {
    if (!leadId) return;
    setLeadId(leadId);
  }, [leadId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
      <MainInfoClient noConvo={false} />
      <GeneralInfoClient showInfo />
      <CallInfo />
      <PolicyInfoClient />
      <NotesForm />
      <div></div>
      <div className="text-sm font-light col-span-2 px-4">
        <p>Lead Phone Number</p>
        <p>
          -Type: <span className="font-bold">unknown</span>
        </p>
        <div className="flex items-center gap-2 group">
          <span>Caller Id for calls /texts</span>
          {edit ? (
            <PhoneSwitcher
              number={defaultNumber}
              onSetDefaultNumber={onSetDefaultNumber}
            />
          ) : (
            <>
              <span className="font-bold">
                {formatPhoneNumber(defaultNumber)}
              </span>
              <Button
                className="opacity-0 group-hover:opacity-100"
                variant="link"
                size="sm"
                onClick={() => setEdit(true)}
              >
                <Pencil size={16} />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
