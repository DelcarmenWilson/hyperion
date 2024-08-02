"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { FullTimeInfo } from "@prisma/client";
import { fullTimeInfoGetByUserId } from "@/actions/blueprint";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FullTimeInfoForm } from "./form";
import { calculateDailyBluePrint } from "@/constants/blue-print";
import { TargetList } from "./list";

export const FullTimeInfoClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isFetching } = useQuery<FullTimeInfo|null>({
    queryFn: () => fullTimeInfoGetByUserId(),
    queryKey: ["agentFullTimeInfo"],
  });
  const formula =calculateDailyBluePrint(data?.annualTarget||0)
  
  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent>
          {/* <b><h3> Input Details</h3></b> */}
          <h3 className="text-2xl font-semibold py-2">Input Details</h3>
        <FullTimeInfoForm fullTimeInfo={data!}
        onClose={()=>setIsOpen(false)}/>
        </DialogContent>
      </Dialog>
      <Card>
      <SkeletonWrapper isLoading={isFetching}>
        <CardTitle>FullTime Details</CardTitle>
        <CardContent className="flex gap-2">
          <div>
          <p>{data?.userId}</p>
          <p>{data?.workType}</p>
          <p>{data?.workingDays}</p>
          <p>{data?.workingHours}</p>
          <p>Annual Target: {data?.annualTarget}</p>
          <p>{data?.createdAt.toDateString()}</p>
          <p>{data?.updatedAt.toDateString()}</p>
       <Button onClick={()=>setIsOpen(true)}>Edit</Button>
       </div>
       {formula.length&&(<TargetList targets={formula}/>)}

       </CardContent>
      </SkeletonWrapper>
      </Card>
    </>
  );
};


