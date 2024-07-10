import { useNodes, useReactFlow } from "reactflow";
import { toast } from "sonner";
import { create } from "zustand";
import {
  WorkflowEdgeSchemaType,
  WorkFlowSchemaType,
} from "@/schemas/workflow/workflow";
import {
  edgeDeleteById,
  edgeUpdateById,
  nodeDeleteById,
  nodeInsert,
  nodeUpdateById,
  workFlowDeleteById,
  workFlowInsert,
  workFlowsGetAllByUserId,
  workFlowUpdateById,
} from "@/actions/workflow";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Workflow, WorkflowDefaultNode } from "@prisma/client";
import {
  workflowDefaultNodesGetAllByType,
  workflowDefaultNodeDeleteById as workflowDefaultNodeDeleteById,
  workflowDefaultNodeInsert,
  workflowDefaultNodeUpdateById,
} from "@/actions/workflow/default";
import { WorkflowActionSchemaType } from "@/schemas/workflow/action";
import { WorkflowBirthdayTriggerSchemaType, WorkflowTriggerSchemaType } from "@/schemas/workflow/trigger";

type TypeList = "actionlist" | "triggerlist" | "edge";
type useWorkFlowStore = {
  //DEFAULT NODES
  workflowId?: string;
  type?: TypeList;
  edge?: WorkflowEdgeSchemaType;
  isDrawerOpen: boolean;
  onDrawerOpen: (w: string, t: TypeList, e?: WorkflowEdgeSchemaType) => void;
  onDrawerClose: () => void;
  //LIVE NODES
  node?: WorkflowTriggerSchemaType;
  isNodeDrawerOpen: boolean;
  onNodeDrawerOpen: (n: WorkflowTriggerSchemaType) => void;
  onNodeDrawerClose: () => void;
};

export const useWorkFlow = create<useWorkFlowStore>((set) => ({
  //DEFAULT NODES
  isDrawerOpen: false,
  onDrawerOpen: (w, t, e) =>
    set({ workflowId: w, type: t, edge: e, isDrawerOpen: true }),
  onDrawerClose: () => set({ isDrawerOpen: false }),
  //LIVE NODES
  isNodeDrawerOpen: false,
  onNodeDrawerOpen: (w) => set({ node: w, isNodeDrawerOpen: true }),
  onNodeDrawerClose: () => set({ isNodeDrawerOpen: false }),
}));

export const useWorkFlowChanges = (onClose?: () => void) => {
  const { setEdges, setNodes } = useReactFlow();
const nodes= useNodes()
  //EDGES
  const onDeleteEdge = async (id?: string) => {
    if (!id) return;
    const deletedEdge = await edgeDeleteById(id);
    if (deletedEdge.success)
      setEdges((eds) => eds.filter((edge) => edge.id != id));
    else toast.error(deletedEdge.error);
  };
  const onUpdateEdge = async (values: WorkflowEdgeSchemaType) => {
    const updatedEdge = await edgeUpdateById(values);
    if (updatedEdge.success) {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === values.id) {
            edge = { ...edge, ...values };
          }
          return edge;
        })
      );
      toast.success("Edge Updated!");
      return true;
    } else toast.error(updatedEdge.error);
    return false;
  };
  //NODES
  const onNodeInsert = async (workflowId: string, id: string, type: string) => {
    const insertedNode = await nodeInsert(workflowId, id as string, type);
    if (insertedNode.success) {
      setNodes((prevNodes) => [...prevNodes, { ...insertedNode.success }]);
      return true;
    } else toast.error(insertedNode.error);
    return false;
  };
  const onNodeDelete = async (id: string,type:string) => {
    if(type=="trigger"&& nodes.length>1){
      toast.error("Please delete the actions first")
      return}
    const deletedNode = await nodeDeleteById(id);
    if (deletedNode.success)
      setNodes((prevNodes) => prevNodes.filter((e) => e.id != id));
    else toast.error(deletedNode.error);
  };
  const onNodeUpdate = async (values: WorkflowBirthdayTriggerSchemaType) => {
    const updatedNode = await nodeUpdateById(values);
    if (updatedNode.success) {
      setNodes((prevNodes) =>
        // prevNodes.filter((e) => e.id != id)
        prevNodes.map((prevNodes) => {
          if (prevNodes.id === values.id) {
            prevNodes = { ...prevNodes, ...values };
          }
          return prevNodes;
        })
      );
      if (onClose) onClose();
    } else toast.error(updatedNode.error);
  };

  return {
    onDeleteEdge,
    onUpdateEdge,
    onNodeInsert,
    onNodeDelete,
    onNodeUpdate,
  };
};

export const useWorkFlowDefaultData = (onClose?: () => void) => {
  const queryClient = useQueryClient();
  const invalidate = (key: string) => {
    queryClient.invalidateQueries({
      queryKey: [`admin${key}`],
    });
  };
  //DEFAULT NODES
  const onGetWorkflowDefaultNodesByType = (type: "trigger" | "action") => {
    const { data, isFetching } = useQuery<WorkflowDefaultNode[] | []>({
      queryKey: [`admin${type}`],
      queryFn: () => workflowDefaultNodesGetAllByType(type),
    });

    return { data, isFetching };
  };
  const onDeleteWorkflowDefaultById = async (id?: string, type?: string) => {
    if (!id || !type) return;
    const deletedAction = await workflowDefaultNodeDeleteById(id);

    if (deletedAction.success) {
      invalidate(type);
      toast.success(deletedAction.success);
    } else toast.error(deletedAction.error);
  };
  const onInsertWorkflowDefaultNode = async (
    values: WorkflowActionSchemaType | WorkflowTriggerSchemaType
  ) => {
    const insertedNode = await workflowDefaultNodeInsert(values);
    if (insertedNode.success) {
      invalidate(values.type);
      toast.success(`${values.type} created!`);
      if(onClose)onClose()
    } else toast.error(insertedNode.error);
  };
  const onUpdateWorkflowDefaultNode = async (
    values: WorkflowActionSchemaType | WorkflowTriggerSchemaType
  ) => {
    const updatedNode = await workflowDefaultNodeUpdateById(values);
    if (updatedNode.success) {
      invalidate(values.type);
      toast.success(`${values.type} updated!`);
      if (onClose) onClose();
    } else toast.error(updatedNode.error);
  };

  return {
    onGetWorkflowDefaultNodesByType,
    onDeleteWorkflowDefaultById,
    onInsertWorkflowDefaultNode,
    onUpdateWorkflowDefaultNode,
  };
};

export const useWorkFlowData = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["agentWorkFlows"],
    });
  };
  //DEFAULT NODES
  const onGetWorkflowByUserId = () => {
    const { data, isFetching } = useQuery<Workflow[]>({
      queryKey: ["agentWorkFlows"],
      queryFn: () => workFlowsGetAllByUserId(),
    });
    return { data, isFetching };
  };
  const onDeleteWorkflowById = async (id?: string) => {
    if (!id) return;
    const deletedWorkFlow = await workFlowDeleteById(id);

    if (deletedWorkFlow.success) {
      invalidate();
      toast.success(deletedWorkFlow.success);
    } else toast.error(deletedWorkFlow.error);
  };
  const onInsertWorkflow = async (values: WorkFlowSchemaType) => {
    const insertedNode = await workFlowInsert(values);
    if (insertedNode.success) {
      invalidate();
      toast.success("WorkFlow created!");
      return true;
    } else toast.error(insertedNode.error);
    return false;
  };
  const onUpdateWorkflow = async (values: WorkFlowSchemaType) => {
    const updatedNode = await workFlowUpdateById(values);
    if (updatedNode.success) {
      invalidate();
      toast.success("WorkFlow Updated");
      return true;
    } else toast.error(updatedNode.error);
    return false;
  };

  return {
    onGetWorkflowByUserId,
    onDeleteWorkflowById,
    onInsertWorkflow,
    onUpdateWorkflow,
  };
};
