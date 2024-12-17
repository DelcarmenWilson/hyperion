import { Facebook, LucideProps } from "lucide-react";
import { TaskParamType, TaskType } from "@/types/workflow/task";
import { WorkflowTask } from "@/types/workflow/workflow";

export const TestLeadTask = {
  type: TaskType.TEST_LEAD_TASK,
  label: "Test leads",
  icon: (props: LucideProps) => (
    <Facebook className="stroke-primary" {...props} />
  ),

  credits: 2,
  inputs: [
    {
      name: "Option",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { value: "Lead", name: "Lead" },
        { value: "Agent", name: "Agent" },
      ],
    },
    {
    name: "Pipeline",
    type: TaskParamType.SELECT_PIPELINE,
    required:true,
    helperText:"Select a pipeline"



    },
    {
      name: "Carriers",
      type: TaskParamType.SELECT_CARRIER,
      required:true,
      helperText:"Select a Carrier"
  
  
  
      }
  ],
  outputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
    },
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ],
} satisfies WorkflowTask;
