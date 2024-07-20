import { FullWorkFlowSchemaType } from "@/schemas/workflow/workflow";
import { WorkFlowClient } from "./components/client";
import { workFlowGetById } from "@/actions/workflow";

const WorkFlowPage = async ({ params }: { params: { id: string } }) => {
  const workflow = await workFlowGetById(params.id);
  return <WorkFlowClient initWorkflow={workflow as FullWorkFlowSchemaType} />;
};

export default WorkFlowPage;
