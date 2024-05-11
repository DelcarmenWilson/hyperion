"use client";
import { cn } from "@/lib/utils";
import { LicenseCard } from "./card";
import { UserLicense } from "@prisma/client";

type LicenseListProps = {
  licenses: UserLicense[];
  size?: string;
};
export const LicenseList = ({ licenses, size = "full" }: LicenseListProps) => {
  return (
    <>
      {licenses.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {licenses.map((license) => (
            <LicenseCard key={license.id} initLicense={license} />
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Licenses Found</p>
        </div>
      )}
    </>
  );
};
