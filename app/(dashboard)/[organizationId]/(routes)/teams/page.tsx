import React from 'react'
import { TeamClient } from './components/client'
import { db } from '@/lib/db'
import { TeamColumn } from './components/columns'
import { format } from 'date-fns'

const TeamsPage = async({params}:{params:{organizationId:string}}) => {

  const teams=await db.team.findMany({where:{
    organizationId:params.organizationId
  },orderBy:{
    createdAt:"desc"
  }})

  const formattedTeams:TeamColumn[]=teams.map((team)=>({
    id:team.id,
    name:team.name,
    createdAt:format(team.createdAt,"MMMM do, yyyy")
    }))

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <TeamClient data={formattedTeams}/>
        </div>
    </div>
  )
}

export default TeamsPage