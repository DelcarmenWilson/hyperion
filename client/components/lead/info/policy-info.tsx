"use client";
import { useCurrentRole } from "@/hooks/user-current-role";
import { useLeadId, useLeadStore } from "@/hooks/lead/use-lead";
import { useLeadPolicyData } from "@/hooks/lead/use-policy-info";

import { EmptyData } from "./empty-data";
import { InputGroup } from "@/components/reusable/input-group";
import { SectionWrapper } from "./section-wrapper";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate } from "@/formulas/dates";
import { DEVADMINS } from "@/constants/user";

export const PolicyInfoClient = () => {
  const role = useCurrentRole();
  const { policy, isFetchingPolicy } = useLeadPolicyData();
  const { onPolicyFormOpen, onAssistantFormOpen } = useLeadStore();
  const { leadId } = useLeadId();

  if (role == "ASSISTANT") return null;

  const leadName = `${policy?.lead.firstName} ${policy?.lead.firstName}`;
  const assistant = policy?.lead.assistant;

  return (
    <SkeletonWrapper isLoading={isFetchingPolicy}>
      <div className="flex flex-col gap-2 text-sm">
        {DEVADMINS.includes(role!) && (
          <SectionWrapper
            title="Assistant"
            onClick={() => onAssistantFormOpen(leadId, leadName, assistant!)}
            showAdd={!assistant}
          >
            {assistant ? (
              <h4 className="text-lg text-center font-bold">
                {assistant.firstName}
              </h4>
            ) : (
              <EmptyData title="No assistant yet" height="auto" />
            )}
          </SectionWrapper>
        )}

        <SectionWrapper
          title="Policy"
          onClick={() => onPolicyFormOpen(leadId)}
          showAdd={!policy}
        >
          {policy ? (
            <>
              <InputGroup title="Carrier" value={policy.carrier.name} />
              <InputGroup title="Policy #" value={policy.policyNumber} />
              <InputGroup title="Status" value={policy.status} />
              <InputGroup
                title="Start Date"
                value={formatDate(policy.startDate)}
              />
              <InputGroup title="Ap" value={policy.ap} />
              <InputGroup title="Commision" value={policy.commision} />
              <InputGroup
                title="Coverage Amount"
                value={policy.coverageAmount}
              />
            </>
          ) : (
            <EmptyData title="No policy yet" height="auto" />
          )}
        </SectionWrapper>
      </div>
    </SkeletonWrapper>
  );
};
