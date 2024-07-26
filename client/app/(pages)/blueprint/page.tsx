import { PageLayout } from '@/components/custom/layout/page-layout'
import { GoalIcon, MessageSquarePlus } from 'lucide-react'
import React from 'react'
import BluePrintClient from './components/client'

import { bluePrintsGetAllByUserId } from '@/actions/blueprint'





const BluePrintPage = async() => {
const bluePrints= await bluePrintsGetAllByUserId()
  return (
    <div>
      
       <PageLayout icon={GoalIcon} title="Blue Print">
       
       <BluePrintClient bluePrintData={bluePrints}/>

      


    
    </PageLayout>
      
    </div>
  )
}

export default BluePrintPage