"use client";
import { cn } from "@/lib/utils";
import { useAgentCarrierData } from "../../hooks/use-carrier";
import { CarrierCard } from "./card";
import { EmptyData } from "@/components/lead/info/empty-data";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type CarrierListProps = {
  size?: string;
};

export const CarrierList = ({ size = "full" }: CarrierListProps) => {
  const { carriers, isFetchingCarriers } = useAgentCarrierData();
  return (
    <SkeletonWrapper isLoading={isFetchingCarriers}>
      {carriers?.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {carriers.map((carrier) => (
            <CarrierCard key={carrier.id} carrier={carrier} />
          ))}
        </div>
      ) : (
        <EmptyData title="No Carriers Found" />
      )}
    </SkeletonWrapper>
  );
};
