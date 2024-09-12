"use client";
import { FilePenLine } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLeadStore, useLeadPolicyActions } from "@/hooks/lead/use-lead";

import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/reusable/input-group";

import { formatDate } from "@/formulas/dates";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const PolicyInfoClient = () => {
  const user = useCurrentUser();
  const { policy, isFetchingPolicy } = useLeadPolicyActions();
  const { onPolicyFormOpen, onAssistantFormOpen } = useLeadStore();

  if (user?.role == "ASSISTANT") return null;
  if (!policy) return null;
  const leadName = `${policy.firstName} ${policy.firstName}`;
  const policyInfo = policy.policy;
  const assistant = policy.assistant;

  return (
    <div className="flex flex-col gap-1 text-sm">
      <SkeletonWrapper isLoading={isFetchingPolicy}>
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
              onClick={() =>
                onAssistantFormOpen(policy.id, leadName, assistant!)
              }
            >
              {assistant ? "Change" : "Add"}
            </Button>
          </div>
        )}

        {policyInfo ? (
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
              onClick={() => onPolicyFormOpen(policy.id)}
            >
              <FilePenLine size={16} />
            </Button>
          </div>
        ) : (
          <Button onClick={() => onPolicyFormOpen(policy.id)}>
            Create Policy
          </Button>
        )}
      </SkeletonWrapper>
    </div>
  );
};
