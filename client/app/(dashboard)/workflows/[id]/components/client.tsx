"use client";
import React, { useCallback, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWorkFlow } from "@/hooks/use-workflow";
import "reactflow/dist/style.css";

import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  NodeChange,
  Panel,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { NODE_TYPES, EDGE_TYPES } from "@/constants/react-flow/node-types";
import {
  FullWorkFlowSchemaType,
  WorkflowEdgeSchemaType,
  WorkFlowSchemaType,
} from "@/schemas/workflow/workflow";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertModal } from "@/components/modals/alert";
import { WorkFlowDrawer } from "@/components/react-flow/drawer";
import { NodeSelect } from "@/components/react-flow/node-select";

import { WorkflowForm } from "@/components/react-flow/form";
import { NodeDrawer } from "@/components/react-flow/node-drawer";
import { edgeInsert, nodesUpdateAllPosition } from "@/actions/workflow";

export const WorkFlowClient = ({
  initWorkflow,
}: {
  initWorkflow: FullWorkFlowSchemaType;
}) => {
  const [workflow, setWorkflow] = useState(initWorkflow);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initWorkflow.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initWorkflow.edges || []
  );
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();

  const { onDrawerOpen } = useWorkFlow();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);

  const onConnect = useCallback(async (e: Connection) => {
    if (!e.source || !e.target) return;
    const insertedEdge = await edgeInsert({
      workflowId: workflow.id,
      source: e.source,
      target: e.target,
      animated: true,
      type: "customBezier",
    });
    if (insertedEdge.success) {
      setEdges((eds) => addEdge(insertedEdge.success, eds));
    }
  }, []);

  const onChangeNodes = (e: NodeChange[]) => {
    const el = e[0];
    // console.log(el);
    if (el.type === "position" && el.dragging) {
      setDisabled(false);
    }
    // if (el.type == "select" && el.selected) {
    //   const selectedNode = nodes.find((e) => e.id == el.id);
    //   console.log(selectedNode);
    // }
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

  const onEdgeClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    edge: Edge<any>
  ) => {
    onDrawerOpen(workflow.id, "edge", edge as WorkflowEdgeSchemaType);
  };

  const onSaveChanges = async () => {
    const updatedNodes = await nodesUpdateAllPosition(nodes);
    if (updatedNodes.success) {
      toast.success(updatedNodes.success);
      setDisabled(true);
    } else toast.error(updatedNodes.error);
  };

  const onSetWorkFlow = (w: WorkFlowSchemaType) => {
    setWorkflow((work) => {
      return { ...work, title: w.title, description: w.description };
    });
  };

  return (
    <>
      <Dialog open={workflowDialogOpen} onOpenChange={setWorkflowDialogOpen}>
        <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
          <h3 className="text-2xl font-semibold py-2">
            WorkFlow Info -{" "}
            <span className="text-primary">{workflow.title}</span>
          </h3>
          <WorkflowForm
            workflow={workflow}
            setWorkFlow={onSetWorkFlow}
            onClose={() => setWorkflowDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertModal
        title="Are you sure you want to exit without saving changes?"
        description="This action cannot be undone."
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => router.push("/workflows")}
        loading={false}
        height="300px"
      />

      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center bg-background p-1 border-b">
          <Button
            onClick={() => {
              if (!disabled) setIsAlertOpen(true);
              else router.push("/workflows");
            }}
          >
            Back to Workflows
          </Button>
          <p className="flex items-center gap-2">
            <span className="text-2xl font-bold">{workflow.title}</span>
            <span> - {workflow.description}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setWorkflowDialogOpen(true)}
            >
              <Pencil size={16} />
            </Button>
          </p>
          <div className="flex items-center gap-2">
            <NodeSelect workFlowId={workflow.id} nodesCount={nodes.length} />
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
            onEdgesChange={onChangeEdges}
            onEdgeDoubleClick={onEdgeClick}
            onConnect={onConnect}
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
      </div>
    </>
  );
};
