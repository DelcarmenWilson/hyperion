"use client";
import { cn } from "@/lib/utils";
import { FullOrganization } from "@/types";
import { OrganizationCard } from "./card";
import { EmptyCard } from "@/components/reusable/empty-card";

type Props = {
  organizations: FullOrganization[];
  size?: string;
};
export const OrganizationList = ({ organizations, size = "full" }: Props) => {
  return (
    <>
      {organizations.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {organizations.map((organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
            />
          ))}
        </div>
      ) : (
        <EmptyCard title="No Organizations Found" />
      )}
    </>
  );
};
