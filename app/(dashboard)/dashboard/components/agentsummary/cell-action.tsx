"use client";
import { Button } from "@/components/ui/button";
import { AgentSummaryColumn } from "./columns";

interface CellActionProps {
  agent: AgentSummaryColumn;
}
export const CellAction = ({ agent }: CellActionProps) => {
  if (!agent.coaching) {
    return null;
  }

  return <div>{agent.currentCall && <Button>Join Call</Button>}</div>;
};
