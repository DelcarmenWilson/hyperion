"use client";
import { cn } from "@/lib/utils";
import { LeadStatus } from "@prisma/client";
import { LeadStatusCard } from "./card";

type LeadStatusListProps = {
  leadStatus: LeadStatus[];
  size?: string;
};
export const LeadStatusList = ({
  leadStatus,
  size = "full",
}: LeadStatusListProps) => {
  return (
    <>
      {leadStatus.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {leadStatus.map((status) => (
            <LeadStatusCard key={status.id} initLeadStatus={status} />
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Lead Status Found</p>
        </div>
      )}
    </>
  );
};
