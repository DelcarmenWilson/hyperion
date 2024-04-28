"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FilePenLine } from "lucide-react";

import { emitter } from "@/lib/event-emmiter";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TextGroup } from "@/components/reusable/input-group";
import { Button } from "@/components/ui/button";

import { PolicyInfoForm } from "./forms/policy-info-form";
import { LeadPolicyInfo } from "@/types";

type PolicyInfoClientProps = {
  leadName: string;
  info: LeadPolicyInfo;
};

export const PolicyInfoClient = ({ leadName, info }: PolicyInfoClientProps) => {
  const [policyInfo, setPolicyInfo] = useState<LeadPolicyInfo>(info);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setPolicyInfo(info);
    const onSetInfo = (e: LeadPolicyInfo) => {
      if (e.leadId == info.leadId) setPolicyInfo(e);
    };
    emitter.on("policyInfoUpdated", (info) => onSetInfo(info));
    return () => {
      emitter.off("policyInfoUpdated", (info) => onSetInfo(info));
    };
  }, [info]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
          <h3 className="text-2xl font-semibold py-2">
            Policy Info - <span className="text-primary">{leadName}</span>
          </h3>
          <PolicyInfoForm
            policyInfo={policyInfo}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-1 text-sm">
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
              onClick={() => setDialogOpen(true)}
            >
              <FilePenLine size={16} />
            </Button>
          </div>
        ) : (
          <Button onClick={() => setDialogOpen(true)}>Create Policy</Button>
        )}
      </div>
    </>
  );
};
