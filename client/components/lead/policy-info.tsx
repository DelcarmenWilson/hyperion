"use client";
import { useEffect, useState } from "react";
import { FilePenLine } from "lucide-react";
import { userEmitter } from "@/lib/event-emmiter";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLead } from "@/hooks/use-lead";

import { User } from "@prisma/client";
import { LeadPolicySchemaType } from "@/schemas/lead";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InputGroup } from "@/components/reusable/input-group";
import { Button } from "@/components/ui/button";

import { PolicyInfoForm } from "./forms/policy-info-form";

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
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const { onAssistantFormOpen } = useLead();

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
      <Dialog open={policyDialogOpen} onOpenChange={setPolicyDialogOpen}>
        <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
          <h3 className="text-2xl font-semibold py-2">
            Policy Info - <span className="text-primary">{leadName}</span>
          </h3>
          <PolicyInfoForm
            policyInfo={policyInfo}
            onClose={() => setPolicyDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-1 text-sm">
        {user?.role == "ADMIN" && (
          <div className="border rounded-sm shadow-md p-2">
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
              onClick={() => setPolicyDialogOpen(true)}
            >
              <FilePenLine size={16} />
            </Button>
          </div>
        ) : (
          <Button onClick={() => setPolicyDialogOpen(true)}>
            Create Policy
          </Button>
        )}
      </div>
    </>
  );
};
