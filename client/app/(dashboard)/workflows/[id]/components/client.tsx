"use client";
import { PaymentProviderSelect } from "@/components/react-flow/payment-provider-select";
import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  Node,
  NodeChange,
  Panel,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";
import { FullWorkFlowSchemaType } from "@/schemas/workflow";
import { TriggerDrawer } from "@/components/react-flow/triggers/drawer";
import { NODE_TYPES, EDGE_TYPES } from "@/constants/react-flow/node-types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { nodesUpdateAllPosition } from "@/actions/workflow";
import { toast } from "sonner";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { code: "St", name: "Stripe" },
    type: "paymentProvider",
  },
  {
    id: "2",
    position: { x: 200, y: 200 },
    data: { amount: "10" },
    type: "paymentInit",
  },
  {
    id: "3",
    position: { x: -10, y: -5 },
    data: { currency: "$", country: "United States", countryCode: "US" },
    type: "paymentCountry",
  },
  {
    id: "4",
    position: { x: -50, y: -5 },
    data: { text: "This is a sample Text", name: "BirthReminder" },
    type: "trigger",
  },
  {
    id: "5",
    position: { x: -30, y: -15 },
    data: { text: "This is a sample Text too", name: "BirthReminder" },
    type: "trigger",
  },
];

export const WorkFlowClient = ({
  workflow,
}: {
  workflow: FullWorkFlowSchemaType;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflow.nodeEdges || []
  );
  const [disabled, setDisabled] = useState(true);

  const onConnect = useCallback((connection: Connection) => {
    const edge = {
      ...connection,
      animated: true,
      id: `${edges.length + 1}`,
      type: "customEdge",
    };
    setEdges((prevEdges) => addEdge(edge, prevEdges));
  }, []);

  const onChangeNodes = (e: NodeChange[]) => {
    const el = e[0];
    if (el.type == "position") {
      setDisabled(false);
    }
    onNodesChange(e);
  };

  const onSaveChanges = async () => {
    const updatedNodes = await nodesUpdateAllPosition(nodes);
    if (updatedNodes.success) {
      toast.success(updatedNodes.success);
      setDisabled(true);
    } else toast.error(updatedNodes.error);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center bg-white p-1 border-b">
        <Button>
          <Link href="/workflows">Back to Workflows</Link>
        </Button>
        <p className="flex items-center">
          <span className="text-2xl font-bold">{workflow.title}</span>
          <span> - {workflow.description}</span>
        </p>
        <div className="flex items-center gap-2">
          <PaymentProviderSelect workFlowId={workflow.id} setNodes={setNodes} />
          <Button disabled={disabled} onClick={onSaveChanges}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onChangeNodes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          fitView
        >
          {/* <Panel position="top-right">
            <PaymentProviderSelect workFlowId={workflow.id} />
          </Panel> */}
          <Panel className="h-full" position="top-right">
            <TriggerDrawer />
          </Panel>
          <Background variant={BackgroundVariant.Cross} />
          <Controls />
          <MiniMap zoomable pannable />
        </ReactFlow>
      </div>
    </div>
  );
};
