"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { FullTimeInfo } from "@prisma/client";
import { fullTimeInfoGetByUserId } from "@/actions/blueprint";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import { EmptyCard } from "@/components/reusable/empty-card";

import { FullTimeInfoForm } from "./form";
import { calculateDailyBluePrint } from "@/constants/blue-print";
import { TargetList } from "./list";
import BluePrintClient from "../client";
import { DetailsCard } from "./details-card";
import { TargetCard } from "./target-card";

export const FullTimeInfoClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isFetching } = useQuery<FullTimeInfo | null>({
    queryFn: () => fullTimeInfoGetByUserId(),
    queryKey: ["agentFullTimeInfo"],
  });
  const targets = calculateDailyBluePrint(data?.annualTarget || 0);

  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent>
          {/* <b><h3> Input Details</h3></b> */}
          <h3 className="text-2xl font-semibold py-2">Input Details</h3>
          <FullTimeInfoForm
            fullTimeInfo={data!}
            onClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <SkeletonWrapper isLoading={isFetching}>
        {data ? (
          <>
            <Card className="mb-2">
              <CardDescription>
                <CardTitle>FullTime Details</CardTitle>
              </CardDescription>
              <CardContent className="flex flex-col lg:flex-row justify-center items-start gap-2">
                <div className="w-ful lg:w-[40%]">
                  <DetailsCard info={data} />
                  <Button onClick={() => setIsOpen(true)}>Edit Details</Button>
                </div>
                {targets.length && (
                  <div className="w-full text-center lg:text-start lg:w-[25%] h-full bg-secondary-foreground text-background p-2">
                    <h4>Current Plan</h4>
                    <TargetCard
                      target={targets.find((e) => e.type == data.targetType)!}
                      size="sm"
                    />
                  </div>

                  // <TargetList
                  //   selectedTarget={data.targetType!}
                  //   targets={formula.filter((e) => e.type == data.targetType)}
                  //   onChange={() => {}}
                  // />
                )}
              </CardContent>
            </Card>

            <BluePrintClient />
          </>
        ) : (
          <EmptyCard
            title="No details Found"
            subTitle={
              <Button onClick={() => setIsOpen(true)}>Add Details</Button>
            }
          />
        )}
      </SkeletonWrapper>
    </>
  );
};
