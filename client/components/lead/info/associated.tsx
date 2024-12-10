"use client";
import { useLeadStore } from "@/stores/lead-store";
import { useLeadData } from "@/hooks/lead/use-lead";
import Link from "next/link";

import { EmptyData } from "./empty-data";
import Hint from "@/components/custom/hint";
import { SectionWrapper } from "./section-wrapper";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { getAge } from "@/formulas/dates";

export const AssociatedClient = () => {
  const { onNewLeadFormOpen, leadId } = useLeadStore();
  const { onGetAssociatedLeads } = useLeadData();
  const { associatedLeads, associatedLeadsFetching } = onGetAssociatedLeads(
    leadId as string
  );

  return (
    <SkeletonWrapper isLoading={associatedLeadsFetching}>
      <div className="flex flex-col gap-2 text-sm">
        <SectionWrapper
          title="Associated Leads"
          onClick={() => onNewLeadFormOpen(true)}
          showAdd
        >
          {associatedLeads ? (
            <>
              {associatedLeads.map((lead) => (
                <Hint key={lead.id} label={`View ${lead.firstName}'s details`}>
                  <Link href={`/leads/${lead.id}`}>
                    <div className="grid grid-cols-3 gap-2 items-center hover:bg-primary/25 p-2">
                      <span>{lead.firstName}</span>

                      <span className="font-semibold">
                        {lead.dateOfBirth ? (
                          <>{getAge(lead.dateOfBirth)} yrs.</>
                        ) : (
                          <>Age N/A</>
                        )}
                      </span>
                      <span>{lead.relationship}</span>
                    </div>
                  </Link>
                </Hint>
              ))}
              {/* {JSON.stringify(leadsAssociated)} */}
              {/* <InputGroup title="Carrier" value={policyInfo.carrier} />

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
              /> */}
            </>
          ) : (
            <EmptyData title="No associated leads" height="auto" />
          )}
        </SectionWrapper>
      </div>
    </SkeletonWrapper>
  );
};
