import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  useNodes,
  useReactFlow,
} from "reactflow";

import { Edge, Node, OnNodesChange, OnEdgesChange, OnConnect } from "reactflow";
import { WorkflowBirthdayTriggerSchemaType } from "@/schemas/workflow/trigger";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  edgeDeleteById,
  edgeInsert,
  edgeUpdateById,
  nodeDeleteById,
  nodeInsert,
  nodesUpdateAllPosition,
  nodeUpdateById,
} from "@/actions/workflow";
import { useMutation } from "@tanstack/react-query";
import { useWorkflowId, useWorkflowStore } from "./use-workflow";
import {
  WorkflowEdgeSchemaType,
  WorkflowNodeSchemaType,
} from "@/schemas/workflow/workflow";

type TypeList = "actionlist" | "triggerlist" | "edge" | "node";
type selectedNodeType = WorkflowNodeSchemaType | WorkflowEdgeSchemaType;
export type EditorState = {
  nodes: Node[];
  edges: Edge[];
  selectedNode?: selectedNodeType;

  type?: TypeList;
  isDrawerOpen: boolean;
  onDrawerOpen: (t: TypeList, s?: selectedNodeType) => void;
  onDrawerClose: () => void;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  deleteNode: (id: string) => void;
  updateNode: (node: Node) => void;
  setEdges: (edges: Edge[]) => void;
  addEdge: (edge: Edge) => void;
  deleteEdge: (id: string) => void;
  updateEdge: (edge: Edge) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: [],
  edges: [],
  // setSelectedNode: (e) => set({ selectedNode: e }),
  //DEFAULT NODES
  isDrawerOpen: false,
  onDrawerOpen: (t, s) => set({ type: t, selectedNode: s, isDrawerOpen: true }),
  onDrawerClose: () => set({ isDrawerOpen: false }),
  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  setNodes: (nodes) => set({ nodes }),
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  deleteNode: (id) =>
    set({ nodes: get().nodes.filter((node) => node.id != id) }),
  updateNode: (newNode) =>
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === newNode.id) node = { ...node, ...newNode };
        return node;
      }),
    }),
  setEdges: (edges) => set({ edges }),
  addEdge: (edge) => set({ edges: addEdge(edge, get().edges) }),
  deleteEdge: (id) =>
    set({ edges: get().edges.filter((edge) => edge.id != id) }),
  updateEdge: (newEdge) =>
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === newEdge.id) edge = { ...edge, ...newEdge };
        return edge;
      }),
    }),
}));

export const useEditorChanges = () => {
  const { workflowId } = useWorkflowId();
  const { setDisabled } = useWorkflowStore();
  const {
    addEdge,
    deleteEdge,
    updateEdge,
    nodes,
    addNode,
    deleteNode,
    updateNode,
    onDrawerClose,
  } = useEditorStore();
  //EDGES
  const { mutate: edgeMutateInsert, isPending: edgeInsertIsPending } =
    useMutation({
      mutationFn: edgeInsert,
      onSuccess: (results) => {
        if (results.success) {
          addEdge(results.success);
          toast.success("Edge created!", { id: "insert-edge" });
          onDrawerClose();
        } else {
          toast.error(results.error, { id: "insert-edge" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onEdgeConnect = useCallback(
    (e: Connection) => {
      if (!e.source || !e.target) return;
      edgeMutateInsert({
        workflowId,
        source: e.source,
        target: e.target,
        animated: true,
        type: "customBezier",
      });
    },
    [edgeMutateInsert]
  );
  // DELETE

  const { mutate: edgeMutateDelete, isPending: edgeDeleteIsPending } =
    useMutation({
      mutationFn: edgeDeleteById,
      onSuccess: (results) => {
        if (results.success) {
          deleteEdge(results.success);
          toast.success("Edge deleted!", { id: "delete-edge" });
          onDrawerClose();
        } else {
          toast.error(results.error, { id: "delete-edge" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onEdgeDelete = useCallback(
    (id: string) => {
      toast.loading("Deleteing edge...", { id: "delete-edge" });
      edgeMutateDelete(id);
    },
    [edgeMutateDelete, workflowId]
  );

  // UPDATE
  const { mutate: edgeMutateUpdate, isPending: edgeUpdateIsPending } =
    useMutation({
      mutationFn: edgeUpdateById,
      onSuccess: (results) => {
        if (results.success) {
          updateEdge(results.success);
          toast.success("Edge updated!", { id: "update-edge" });
          onDrawerClose();
        } else {
          toast.error(results.error, { id: "update-edge" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onEdgeUpdate = useCallback(
    (values: WorkflowEdgeSchemaType) => {
      toast.loading("Updating edge...", { id: "update-edge" });
      edgeMutateUpdate(values);
    },
    [edgeMutateUpdate, workflowId]
  );
  //NODES
  //INSERT
  const { mutate: nodeMutateInsert, isPending: nodeInsertIsPending } =
    useMutation({
      mutationFn: nodeInsert,
      onSuccess: (results) => {
        if (results.success) {
          addNode(results.success);
          toast.success("Node created!", { id: "insert-node" });
          onDrawerClose();
        } else {
          toast.error(results.error, { id: "insert-node" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onNodeInsert = useCallback(
    (id: string, type: string) => {
      toast.loading("Creating new node...", { id: "insert-node" });
      nodeMutateInsert({ workflowId, id, type });
    },
    [nodeMutateInsert, workflowId]
  );

  //DELETE
  const { mutate: nodeMutateDelete, isPending: nodeDeleteIsPending } =
    useMutation({
      mutationFn: nodeDeleteById,
      onSuccess: (results) => {
        if (results.success) {
          deleteNode(results.data.id);
          toast.success("Node deleted!", { id: "delete-node" });
          onDrawerClose();
        } else {
          toast.error(results.error, { id: "delete-node" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onNodeDelete = useCallback(
    (id: string, type: string) => {
      if (type == "trigger" && nodes.length > 1) {
        toast.error("Please delete the actions first", { id: "delete-node" });
        return;
      }
      toast.loading("Deleteing node...", { id: "delete-node" });
      nodeMutateDelete(id);
    },
    [nodeMutateDelete, workflowId]
  );
  //UPDATE
  const { mutate: nodeMutateUpdate, isPending: nodeUpdateIsPending } =
    useMutation({
      mutationFn: nodeUpdateById,
      onSuccess: (results) => {
        if (results.success) {
          updateNode(results.success);
          toast.success("Node updated!", { id: "update-node" });
          onDrawerClose();
        } else {
          toast.error(results.error, { id: "update-node" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onNodeUpdate = useCallback(
    (values: WorkflowNodeSchemaType) => {
      toast.loading("Updating node...", { id: "update-node" });
      nodeMutateUpdate(values);
    },
    [nodeMutateUpdate, workflowId]
  );

  //UPDATE ALL
  const { mutate: nodeMutateUpdateAll, isPending: nodeUpdateAllIsPending } =
    useMutation({
      mutationFn: nodesUpdateAllPosition,
      onSuccess: (results) => {
        if (results.success) {
          setDisabled(true);
          toast.success("Saved!", { id: "update-nodes" });
        } else {
          toast.error(results.error, { id: "update-nodes" });
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onNodeUpdateAll = useCallback(() => {
    toast.loading("Saving changes...", { id: "update-nodes" });
    nodeMutateUpdateAll(nodes);
  }, [nodeMutateUpdateAll, nodes]);

  return {
    onEdgeConnect,
    onEdgeDelete,
    edgeDeleteIsPending,
    onEdgeUpdate,
    edgeUpdateIsPending,
    onNodeInsert,
    nodeInsertIsPending,
    onNodeDelete,
    nodeDeleteIsPending,
    onNodeUpdate,
    nodeUpdateIsPending,
    onNodeUpdateAll,
    nodeUpdateAllIsPending,
  };
};
