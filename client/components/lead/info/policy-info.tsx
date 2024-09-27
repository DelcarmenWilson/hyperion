"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { useLeadPolicyData } from "@/hooks/lead/use-policy-info";

import { EmptyData } from "./empty-data";
import { InputGroup } from "@/components/reusable/input-group";
import { SectionWrapper } from "./section-wrapper";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate } from "@/formulas/dates";

export const PolicyInfoClient = () => {
  const user = useCurrentUser();
  const { policy, isFetchingPolicy } = useLeadPolicyData();
  const { onPolicyFormOpen, onAssistantFormOpen } = useLeadStore();

  if (user?.role == "ASSISTANT") return null;

  const leadName = `${policy?.firstName} ${policy?.firstName}`;
  const policyInfo = policy?.policy;
  const assistant = policy?.assistant;

  return (
    <SkeletonWrapper isLoading={isFetchingPolicy}>
      {policy ? (
        <div className="flex flex-col gap-2 text-sm">
          {user?.role == "ADMIN" && (
            <SectionWrapper
              title="Assistant"
              onClick={() =>
                onAssistantFormOpen(policy.id, leadName, assistant!)
              }
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
            onClick={() => onPolicyFormOpen(policy.id)}
            showAdd={!policyInfo}
          >
            {/* <div>
            <p>Vendor:</p>
            <p className="text-primary ml-4">
              {policyInfo.vendor.replace("_", " ")}
            </p>
          </div> */}
            {policyInfo ? (
              <>
                <InputGroup title="Carrier" value={policyInfo.carrier} />

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
              </>
            ) : (
              <EmptyData title="No policy yet" height="auto" />
            )}
          </SectionWrapper>
        </div>
      ) : (
        <EmptyData />
      )}
    </SkeletonWrapper>
  );
};
