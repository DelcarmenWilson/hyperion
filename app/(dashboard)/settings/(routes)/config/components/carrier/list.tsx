"use client";
import { cn } from "@/lib/utils";
import { CarrierCard } from "./card";
import { FullUserCarrier } from "@/types";

type CarrierListProps = {
  carriers: FullUserCarrier[];
  size?: string;
};
export const CarrierList = ({ carriers, size = "full" }: CarrierListProps) => {
  return (
    <>
      {carriers.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {carriers.map((carrier) => (
            <CarrierCard key={carrier.id} initCarrier={carrier} />
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Carriers Found</p>
        </div>
      )}
    </>
  );
};
