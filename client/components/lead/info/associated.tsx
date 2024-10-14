"use client";
import { useLeadAssociatedData, useLeadStore } from "@/hooks/lead/use-lead";

import { EmptyData } from "./empty-data";
import { InputGroup } from "@/components/reusable/input-group";
import { SectionWrapper } from "./section-wrapper";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import Link from "next/link";
import { getAge } from "@/formulas/dates";
import Hint from "@/components/custom/hint";

export const AssociatedClient = () => {
  const { leadsAssociated, isFetchingLeadsAssociated } =
    useLeadAssociatedData();
  const { onNewLeadFormOpen } = useLeadStore();

  return (
    <SkeletonWrapper isLoading={isFetchingLeadsAssociated}>
      <div className="flex flex-col gap-2 text-sm">
        <SectionWrapper
          title="Associated Leads"
          onClick={() => onNewLeadFormOpen(true)}
          showAdd
        >
          {leadsAssociated ? (
            <>
              {leadsAssociated.map((lead) => (
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
