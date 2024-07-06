"use client";
import {
  edgeDeleteById,
  edgeInsert,
  nodeInsert,
  nodesUpdateAllPosition,
} from "@/actions/workflow";
import { Button } from "@/components/ui/button";
import { FullNodeSchemaType, FullWorkFlowSchemaType } from "@/schemas/workflow";
import { Plus } from "lucide-react";
import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  NodeChange,
  EdgeChange,
  Connection,
  BackgroundVariant,
} from "reactflow";

import "reactflow/dist/style.css";
import { toast } from "sonner";

export const ReactFlowClient = ({
  workflow,
}: {
  workflow: FullWorkFlowSchemaType;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.nodeEdges);

  const [disabled, setDisabled] = useState(true);

  // const onConnect = useCallback(
  //   (params: any) =>
  //     setEdges((eds) => {
  //       console.log(params);
  //       return addEdge(params, eds);
  //     }),
  //   [setEdges]
  // );

  const onConnect = async (e: Connection) => {
    if (!e.source || !e.target) return;
    const insertedEdge = await edgeInsert(e.source, e.target);
    if (insertedEdge.success) {
      setEdges((eds) => {
        const data = addEdge(e, eds);
        data[0].id = insertedEdge.success.id;
        return data;
      });
    }
  };
  const onCreateNode = async () => {
    const json = { name: "Google Pay", code: "Gp" };
    const newNode = await nodeInsert(workflow.id, json, "paymentProvider");
    if (newNode.success) {
      setNodes([...nodes, newNode.success]);
    } else {
      toast.error("There was an error creating the Node!");
    }
  };

  const onChangeNodes = (e: NodeChange[]) => {
    const el = e[0];
    if (el.type == "position") {
      setDisabled(false);
    }
    //   if (el.dragging) {
    //     if (!el.position) return;
    //     setLastPosition({ x: el.position?.x, y: el.position?.y });
    //   } else {
    //     console.log(lastPosition);
    //   }
    // }
    onNodesChange(e);
  };

  const onChangeEdges = async (e: EdgeChange[]) => {
    const el = e[0];

    if (el.type == "remove") {
      const deletedEdge = await edgeDeleteById(el.id);
      if (deletedEdge.success) {
        toast.success(deletedEdge.success);
      } else toast.error(deletedEdge.error);
    }
    onEdgesChange(e);
  };

  const onSaveChanges = async () => {
    const updatedNodes = await nodesUpdateAllPosition(nodes);
    if (updatedNodes.success) {
      toast.success(updatedNodes.success);
      setDisabled(true);
    } else toast.error(updatedNodes.error);
  };
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onChangeNodes}
      onEdgesChange={onChangeEdges}
      onConnect={onConnect}
      fitView
      attributionPosition="top-right"
      className="overview"
    >
      <MiniMap zoomable pannable />
      <Panel position="top-left" className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <Button className="gap-2" onClick={onCreateNode}>
            Add Node
            <Plus size={15} />
          </Button>
          <Button disabled={disabled} onClick={onSaveChanges}>
            Save Changes
          </Button>
        </div>
        <div>
          <p className="text-2xl">
            {workflow.title} - {workflow.description}
          </p>
        </div>
      </Panel>
      <Controls />
      <Background color="#ccc" variant={BackgroundVariant.Cross} />
    </ReactFlow>
  );
};
