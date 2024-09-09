"use client";
import { cn } from "@/lib/utils";
import { HyperionLead } from "@prisma/client";
import { HyperionLeadCard } from "./card";

type HyperionLeadListProps = {
  leads: HyperionLead[];
  size?: string;
};
export const HyperionLeadList = ({
  leads,
  size = "full",
}: HyperionLeadListProps) => {
  return (
    <>
      {leads.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {leads.map((lead) => (
            <HyperionLeadCard key={lead.id} initLead={lead} />
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Hyperion Leads Found</p>
        </div>
      )}
    </>
  );
};
