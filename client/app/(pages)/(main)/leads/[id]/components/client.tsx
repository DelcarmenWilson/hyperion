"use client";
import { useEffect } from "react";
import { Pencil } from "lucide-react";
import { useLeadData, useLeadId, useLeadStore } from "@/hooks/lead/use-lead";

import { AssociatedClient } from "@/components/lead/info/associated";
import { Button } from "@/components/ui/button";
import { GeneralInfoClient } from "@/components/lead/info/general";
import { PolicyInfoClient } from "@/components/lead/info/policy-info";
import { CallInfo } from "@/components/lead/info/call";
import { MainInfoClient } from "@/components/lead/info/main";
import { NotesForm } from "@/components/lead/forms/notes-form";

import { PhoneSwitcher } from "@/components/phone/addins/switcher";

import { formatPhoneNumber } from "@/formulas/phones";

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
      <MainInfoClient leadId={leadId} noConvo={false} />
      <GeneralInfoClient leadId={leadId} showInfo />
      <CallInfo leadId={leadId} />
      <PolicyInfoClient leadId={leadId} />
      <NotesForm leadId={leadId} />
      <AssociatedClient />
      <div className="text-sm font-light col-span-2 px-4">
        <p>Lead Phone Number</p>
        <p className="pl-4">
          -Type: <span className="font-bold">unknown</span>
        </p>
        <div className="group">
          <span>Caller Id for calls /texts</span>
          <div className="flex items-center gap-2 pl-4">
            {edit ? (
              <PhoneSwitcher
                number={defaultNumber}
                onSetDefaultNumber={(e) => onSetDefaultNumber(leadId, e)}
                onClose={() => setEdit(false)}
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
    </div>
  );
};
