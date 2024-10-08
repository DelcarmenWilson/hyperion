"use client";
import Link from "next/link";
import { FullOrganization } from "@/types";
import { CardData } from "@/components/reusable/card-data";
import { TeamCard } from "./team-card";
import { formatDate } from "@/formulas/dates";

type Props = {
  organization: FullOrganization;
};
export const OrganizationCard = ({ organization }: Props) => {
  return (
    <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm h-[475px] gap-2">
      <Link
        className="text-2xl text-primary font-semibold text-center hover:bg-primary hover:text-background"
        href={`/admin/organizations/${organization.id}`}
      >
        {organization.name}
      </Link>
      <CardData
        label="Date Created"
        value={formatDate(organization.createdAt)}
      />
      <CardData
        label="Date Updated"
        value={formatDate(organization.updatedAt)}
      />
      {organization.teams && (
        <div className="flex-1 flex flex-col overflow-hidden shadow-sm p-2">
          <h4 className="flex justify-between items-center text-lg font-semibold">
            Teams
            <span>{organization.teams.length}</span>
          </h4>
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-y-auto ">
            {organization.teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
