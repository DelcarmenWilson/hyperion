import { Button } from "@/components/ui/button";

import { Pencil } from "lucide-react";
import React from "react";
import { useWorkflowData, useWorkflowStore } from "../../hooks/use-workflow";

import { WorkflowForm } from "@/components/workflow/form";
import { useRouter } from "next/navigation";

export const WorkflowHeader = () => {

    const router=useRouter()
    const {workflowData}=useWorkflowData()
    const {setFormOpen}=useWorkflowStore()
  return (
    <>
    <WorkflowForm />
    <div className="flex items-center justify-between w-full gap-2 border-b p-2">
      <Button onClick={()=>router.push("/workflows")}>Back to Workflows</Button>
     <div  className="flex gap-2 items-center">

      <span>{workflowData?.title}-{workflowData?.description}</span>

      <Button onClick={setFormOpen}>
        <Pencil size={15} />
      </Button>
      </div>
<div className="flex gap-2">
      <Button>Add Node</Button>

      <Button>Save Changes</Button>
      </div>
  
    </div>
    
</>
  );
};