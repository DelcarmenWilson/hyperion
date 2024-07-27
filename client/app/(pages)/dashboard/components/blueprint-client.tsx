"use client"
import { bluePrintActive } from '@/actions/blueprint'
import { PageLayout } from '@/components/custom/layout/page-layout'
import { BluePrint } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { GoalIcon } from 'lucide-react'
import React from 'react'

export const BluePrintClient = () => {
   
    const { data:blueprint, isFetching } = useQuery<BluePrint|null>({
        queryFn: () => bluePrintActive(),
        queryKey: ["agentBluePrintActive"],
      });
  return (
    <PageLayout icon={GoalIcon} title='Blue Print'>
      <div>
   {/* {JSON.stringify(blueprint)} */}
   <p>Type: {blueprint?.type}</p>
   <p>Active Target: {blueprint?.actualTarget}</p>
   <p> Planned Target: {blueprint?.plannedTarget}</p>
   <p>Created At: {blueprint?.createdAt.toDateString()}</p>
   <p>End Date: {blueprint?.endDate.toDateString()}</p> 
   
  
   
   

   </div>
    </PageLayout>
  )
}


