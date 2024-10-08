"use client";
import { useEffect, useState } from "react";
import { FilePenLine } from "lucide-react";
import { userEmitter } from "@/lib/event-emmiter";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLeadStore } from "@/hooks/lead/use-lead";

import { User } from "@prisma/client";
import { LeadPolicySchemaType } from "@/schemas/lead";

import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/reusable/input-group";

import { formatDate } from "@/formulas/dates";

type PolicyInfoClientProps = {
  leadId: string;
  leadName: string;
  info: LeadPolicySchemaType;
  assistant: User | null | undefined;
};

export const PolicyInfoClient = ({
  leadId,
  leadName,
  info,
  assistant,
}: PolicyInfoClientProps) => {
  const user = useCurrentUser();
  const [policyInfo, setPolicyInfo] = useState(info);
  const { onPolicyFormOpen } = useLeadStore();
  const { onAssistantFormOpen } = useLeadStore();

  useEffect(() => {
    setPolicyInfo(info);
    const onSetInfo = (e: LeadPolicySchemaType) => {
      if (e.leadId == info.leadId) setPolicyInfo(e);
    };
    userEmitter.on("policyInfoUpdated", (info) => onSetInfo(info));
    return () => {
      userEmitter.off("policyInfoUpdated", (info) => onSetInfo(info));
    };
  }, [info]);
  if (user?.role == "ASSISTANT") return null;
  return (
    <>
      <div className="flex flex-col gap-1 text-sm">
        {user?.role == "ADMIN" && (
          <div className="border rounded-sm shadow-md p-2  bg-background">
            <h4 className="text-muted-foreground">Assistant</h4>
            {assistant && (
              <h4 className="text-lg text-center font-bold">
                {assistant.firstName}
              </h4>
            )}
            <Button
              className="w-full"
              size="sm"
              onClick={() => onAssistantFormOpen(leadId, leadName, assistant!)}
            >
              {assistant ? "Change" : "Add"}
            </Button>
          </div>
        )}

        {policyInfo.carrier ? (
          <div className="relative group">
            {/* <div>
            <p>Vendor:</p>
            <p className="text-primary ml-4">
              {policyInfo.vendor.replace("_", " ")}
            </p>
          </div> */}
            <InputGroup
              title="Carrier"
              value={policyInfo.carrier ? policyInfo.carrier : ""}
            />

            <InputGroup
              title="Policy #"
              value={policyInfo.policyNumber ? policyInfo.policyNumber : ""}
            />
            <InputGroup
              title="Status"
              value={policyInfo.status ? policyInfo.status : ""}
            />
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
          <Button onClick={() => onPolicyFormOpen(leadId)}>
            Create Policy
          </Button>
        )}
      </div>
    </>
  );
};
