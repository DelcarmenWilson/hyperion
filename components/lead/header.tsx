"use client";
import { LeadDropDown } from "@/components/lead/dropdown";
import { FullLeadNoConvo } from "@/types";

type LeadHeaderProps = {
  lead: FullLeadNoConvo;
};

export const LeadHeader = ({ lead }: LeadHeaderProps) => {
  return (
    <>
      <div className="flex justify-center items-center gap-2 bg-secondary">
        <h3 className="text-2xl  font-bold">
          <span className="text-primary">
            {lead.firstName} {lead.lastName}
          </span>
          {" | "}
          <span className="italic text-muted-foreground mr-2">
            {lead.gender.substring(0, 1)} {lead.maritalStatus}
          </span>
        </h3>
        <LeadDropDown lead={lead} />
      </div>
    </>
  );
};
