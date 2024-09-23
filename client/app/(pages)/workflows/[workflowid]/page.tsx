"use client";
import { useWorkflowData } from "@/hooks/workflow/use-workflow";
import { WorkflowEditor } from "./components/editor";
import { WorkflowHeader } from "./components/header";
import { useEffect } from "react";
import { useEditorStore } from "@/hooks/workflow/use-editor";
import { EmptyCard } from "@/components/reusable/empty-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const WorkFlowPage = () => {
  const { setNodes, setEdges } = useEditorStore();
  const { workflow, isFetchingWorkflow } = useWorkflowData();

  useEffect(() => {
    if (!workflow) return;
    setNodes(workflow.nodes);
    setEdges(workflow.edges);
  }, [workflow]);
  return (
    <SkeletonWrapper isLoading={isFetchingWorkflow}>
      {workflow ? (
        <div className="flex flex-col w-full h-full bg-background">
          <WorkflowHeader />
          <WorkflowEditor />
        </div>
      ) : (
        <EmptyCard
          title="This workflow no longer exists"
          subTitle={
            <Button>
              <Link href="/workflows">Back To Workflows</Link>
            </Button>
          }
        />
      )}
    </SkeletonWrapper>
  );
};

export default WorkFlowPage;
