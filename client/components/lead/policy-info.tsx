"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FilePenLine } from "lucide-react";

import { userEmitter } from "@/lib/event-emmiter";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TextGroup } from "@/components/reusable/input-group";
import { Button } from "@/components/ui/button";

import { PolicyInfoForm } from "./forms/policy-info-form";
import { LeadPolicyInfo } from "@/types";
import { User } from "@prisma/client";
import { AssistantForm } from "./forms/assistant-form";
import { useCurrentUser } from "@/hooks/use-current-user";

type PolicyInfoClientProps = {
  leadId: string;
  leadName: string;
  info: LeadPolicyInfo;
  assistant: User | null | undefined;
};

export const PolicyInfoClient = ({
  leadId,
  leadName,
  info,
  assistant,
}: PolicyInfoClientProps) => {
  const user = useCurrentUser();
  const [policyInfo, setPolicyInfo] = useState<LeadPolicyInfo>(info);
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [assitantDialogOpen, setAssitantDialogOpen] = useState(false);

  useEffect(() => {
    setPolicyInfo(info);
    const onSetInfo = (e: LeadPolicyInfo) => {
      if (e.leadId == info.leadId) setPolicyInfo(e);
    };
    userEmitter.on("policyInfoUpdated", (info) => onSetInfo(info));
    return () => {
      userEmitter.off("policyInfoUpdated", (info) => onSetInfo(info));
    };
  }, [info]);

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
      <Dialog open={assitantDialogOpen} onOpenChange={setAssitantDialogOpen}>
        <DialogContent className="flex flex-col justify-start h-auto max-w-screen-sm">
          <h3 className="text-2xl font-semibold py-2">
            Assistant for - <span className="text-primary">{leadName}</span>
          </h3>
          <AssistantForm
            leadId={leadId}
            assistant={assistant}
            onClose={() => setAssitantDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-1 text-sm">
        {user?.role != "ASSISTANT" && (
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
              onClick={() => setAssitantDialogOpen(true)}
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
            <TextGroup
              title="Carrier"
              value={policyInfo.carrier ? policyInfo.carrier : ""}
            />

            <TextGroup
              title="Policy #"
              value={policyInfo.policyNumber ? policyInfo.policyNumber : ""}
            />
            <TextGroup
              title="Status"
              value={policyInfo.status ? policyInfo.status : ""}
            />
            <TextGroup
              title="Start Date"
              value={
                policyInfo.startDate
                  ? format(policyInfo.startDate, "MM-dd-yyyy")
                  : ""
              }
            />
            <TextGroup
              title="Ap"
              value={policyInfo.ap ? `$${policyInfo.ap}` : ""}
            />

            <TextGroup
              title="Commision"
              value={policyInfo.commision ? `$${policyInfo.commision}` : ""}
            />
            <TextGroup
              title="Coverage Amount"
              value={policyInfo.coverageAmount ? policyInfo.coverageAmount : ""}
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
