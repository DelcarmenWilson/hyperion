import {  useReactFlow } from "reactflow";
import { toast } from "sonner";
import { create } from "zustand";
import { WorkflowEdgeSchemaType } from "@/schemas/workflow/workflow";
import { edgeDeleteById, edgeUpdateById, nodeDeleteById, nodeInsert, } from "@/actions/workflow";

type TypeList="actionlist" | "triggerlist" | "edge";
type useWorkFlowStore = {
  workflowId?: string;
  type?: TypeList
  edge?: WorkflowEdgeSchemaType;

  isDrawerOpen: boolean;
  onDrawerOpen: (
    w: string,
    t: TypeList,
    e?: WorkflowEdgeSchemaType
  ) => void;
  onDrawerClose: () => void;
};

export const useWorkFlow = create<useWorkFlowStore>((set) => ({
  isDrawerOpen: false,
  onDrawerOpen: (w, t, e) =>
    set({ workflowId: w, type: t, edge: e, isDrawerOpen: true }),
  onDrawerClose: () => set({ isDrawerOpen: false }),
}));

export const useWorkFlowChanges = () => {
  const { setEdges,setNodes } = useReactFlow();
  //EDGES
  const onDeleteEdge = async (id: string) => {
    const deletedEdge = await edgeDeleteById(id);
    if (deletedEdge.success)
      setEdges((eds) => eds.filter((edge) => edge.id != id));
    else toast.error(deletedEdge.error);
  };
  const onUpdateEdge=async(values: WorkflowEdgeSchemaType)=>{
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
      return true
    } else toast.error(updatedEdge.error);    
    return false
  }
  //NODES
  const onNodeInsert=async(workflowId:string,id:string,type:string)=>{
    const insertedNode = await nodeInsert(workflowId, id as string, type);
    if (insertedNode.success) {
      setNodes((prevNodes) => [...prevNodes, {...insertedNode.success}]);
      return true
    } else toast.error(insertedNode.error);
    return false
  }
  const onNodeDelete=async(id:string)=>{
    const deletedNode = await nodeDeleteById(id);
    if (deletedNode.success)
      setNodes((prevNodes) => prevNodes.filter((e) => e.id != id));
    else toast.error(deletedNode.error);
  }

  return {
    onDeleteEdge,
    onUpdateEdge,
    onNodeInsert,
    onNodeDelete
  };
};
