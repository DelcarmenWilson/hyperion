"use client";
import "reactflow/dist/style.css";
import { useCallback } from "react";
import { useWorkflowStore } from "@/hooks/workflow/use-workflow";

import { useEditorChanges, useEditorStore } from "@/hooks/workflow/use-editor";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  Node,
  NodeChange,
  Panel,
} from "reactflow";

import { NODE_TYPES, EDGE_TYPES } from "@/constants/react-flow/node-types";
import {
  WorkflowEdgeSchemaType,
  WorkflowNodeSchemaType,
} from "@/schemas/workflow/workflow";

import { WorkFlowDrawer } from "@/components/workflow/drawer";
import { NodeDrawer } from "@/components/workflow/node-drawer";

export const WorkflowEditor = () => {
  const { setDisabled } = useWorkflowStore();
  const { nodes, onNodesChange, edges, onEdgesChange, onDrawerOpen } =
    useEditorStore();
  const { onEdgeConnect } = useEditorChanges();

  const onChangeNodes = (e: NodeChange[]) => {
    const el = e[0];
    if (el.type === "position" && el.dragging) setDisabled(false);
    onNodesChange(e);
  };

  const onChangeEdges = (e: EdgeChange[]) => {
    const el = e[0];
    if (el.type === "remove") {
      //TODO- need to see how we can incluse this in the store
      // onDeleteEdge(el.id);
    }
    onEdgesChange(e);
  };

  const onEdgeClick = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>, edge: Edge<any>) => {
      onDrawerOpen("edge", edge as WorkflowEdgeSchemaType);
    },
    []
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>, node: Node<any>) => {
      onDrawerOpen("node", node as WorkflowNodeSchemaType);
    },
    []
  );

  return (
    <div className="flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onChangeNodes}
        onEdgesChange={onChangeEdges}
        onEdgeDoubleClick={onEdgeClick}
        onConnect={onEdgeConnect}
        onNodeDoubleClick={onNodeClick}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        deleteKeyCode={["Delete", "Backspace"]}
        defaultMarkerColor="#555"
        fitView
      >
        <Panel className="h-full" position="top-right">
          <WorkFlowDrawer />
          <NodeDrawer />
        </Panel>
        <Background variant={BackgroundVariant.Cross} />
        <Controls />
        <MiniMap zoomable pannable />
      </ReactFlow>
    </div>
  );
};
