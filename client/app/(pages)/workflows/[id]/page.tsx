"use client"

import React from 'react'
import { useWorkflowId } from '../hooks/use-workflow'
import { WorkflowHeader } from './components/header'

function workflowPage() {

    // const {workflowId}=useWorkflowId()

    const {workflowId}=useWorkflowId()
  return (
    <div className="bg-background w-full">
      
      <WorkflowHeader/>
    </div>
  )
}

export default workflowPage
