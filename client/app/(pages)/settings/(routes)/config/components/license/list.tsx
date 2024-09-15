"use client";
import { cn } from "@/lib/utils";
import { useAgentLicenseData } from "../../hooks/use-license";
import { LicenseCard } from "./card";
import { EmptyData } from "@/components/lead/info/empty-data";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type LicenseListProps = {
  size?: string;
};
export const LicenseList = ({ size = "full" }: LicenseListProps) => {
  const { licenses, isFetchingLicenses } = useAgentLicenseData();
  return (
    <SkeletonWrapper isLoading={isFetchingLicenses}>
      {licenses?.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {licenses.map((license) => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </div>
      ) : (
        <div>
          <EmptyData title="No Licenses Found" />
        </div>
      )}
    </SkeletonWrapper>
  );
};
