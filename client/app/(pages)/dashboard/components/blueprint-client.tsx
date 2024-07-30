"use client";
import React from "react";
import { GoalIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { BluePrint } from "@prisma/client";

import { CardLayout } from "@/components/custom/card/layout";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { EmptyCard } from "@/components/reusable/empty-card";
import { bluePrintActive } from "@/actions/blueprint";

export const BluePrintClient = () => {
  const { data: blueprint, isFetching } = useQuery<BluePrint | null>({
    queryFn: () => bluePrintActive(),
    queryKey: ["agentBluePrintActive"],
  });
  return (
    <CardLayout icon={GoalIcon} title="Blue Print">
      <SkeletonWrapper isLoading={isFetching}>
        {blueprint ? (
          <div>
            <p>Type: {blueprint.type}</p>
            <p>Active Target: {blueprint.actualTarget}</p>
            <p> Planned Target: {blueprint.plannedTarget}</p>
            <p>Created At: {blueprint.createdAt.toDateString()}</p>
            <p>End Date: {blueprint.endDate.toDateString()}</p>
          </div>
        ) : (
          <EmptyCard title={"No Blueprint"} />
        )}
      </SkeletonWrapper>
    </CardLayout>
  );
};
