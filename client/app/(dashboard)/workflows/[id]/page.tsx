import { workFlowGetById } from "@/actions/workflow";
import { WorkFlowClient } from "./components/client";
import { FullWorkFlowSchemaType } from "@/schemas/workflow";

const WorkFlowPage = async ({ params }: { params: { id: string } }) => {
  const workflow = await workFlowGetById(params.id);
  return <WorkFlowClient workflow={workflow as FullWorkFlowSchemaType} />;
};

export default WorkFlowPage;
