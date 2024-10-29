"use client";
import { useEffect, useState } from "react";
import { Edit, FilePenLine, Plus } from "lucide-react";
import { userEmitter } from "@/lib/event-emmiter";
import { useCurrentRole } from "@/hooks/user-current-role";
import { useLeadStore } from "@/hooks/lead/use-lead";

import { User } from "@prisma/client";
import { FullLeadPolicy } from "@/types";

import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/reusable/input-group";

import { formatDate } from "@/formulas/dates";
import { ALLADMINS } from "@/constants/user";

type PolicyInfoClientProps = {
  leadId: string;
  leadName: string;
  info: FullLeadPolicy;
  assistant: User | null | undefined;
};

export const PolicyInfoClient = ({
  leadId,
  leadName,
  info,
  assistant,
}: PolicyInfoClientProps) => {
  const role = useCurrentRole();
  const [policyInfo, setPolicyInfo] = useState(info);
  const { onPolicyFormOpen } = useLeadStore();
  const { onAssistantFormOpen } = useLeadStore();

  useEffect(() => {
    setPolicyInfo(info);
    const onSetInfo = (e: FullLeadPolicy) => {
      if (e?.leadId == info?.leadId) setPolicyInfo(e);
    };
    userEmitter.on("policyInfoUpdated", (info) => onSetInfo(info));
    return () => {
      userEmitter.off("policyInfoUpdated", (info) => onSetInfo(info));
    };
  }, [info]);
  if (role == "ASSISTANT" || !policyInfo) return null;
  return (
    <div className="flex flex-col gap-1 text-sm">
      {ALLADMINS.includes(role!) && (
        <div className="border rounded-sm shadow-md p-2  bg-background">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Assistant</p>
            <Button
              size="icon"
              onClick={() => onAssistantFormOpen(leadId, leadName, assistant!)}
            >
              {assistant ? <Edit size={15} /> : <Plus size={15} />}
            </Button>
          </div>

          {assistant && (
            <h4 className="text-lg text-center font-bold">
              {assistant.firstName}
            </h4>
          )}
        </div>
      )}

      {policyInfo.carrier ? (
        <div className="relative group">
          <InputGroup title="Carrier" value={policyInfo.carrier.name} />

          <InputGroup title="Policy #" value={policyInfo.policyNumber} />
          <InputGroup title="Status" value={policyInfo.status} />
          <InputGroup
            title="Start Date"
            value={formatDate(policyInfo.startDate)}
          />
          <InputGroup title="Ap" value={policyInfo.ap} />
          <InputGroup title="Commision" value={policyInfo.commision} />
          <InputGroup
            title="Coverage Amount"
            value={policyInfo.coverageAmount}
          />
          <Button
            className="absolute  bottom-0 right-0 rounded-full lg:opacity-0 group-hover:opacity-100"
            onClick={() => onPolicyFormOpen(leadId)}
          >
            <FilePenLine size={16} />
          </Button>
        </div>
      ) : (
        <Button onClick={() => onPolicyFormOpen(leadId)}>Create Policy</Button>
      )}
    </div>
  );
};
