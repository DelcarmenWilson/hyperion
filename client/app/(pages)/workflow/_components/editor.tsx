import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowValidationContextProvider } from "@/components/context/flow-validation-context";

import { Workflow } from "@prisma/client";

import FlowEditor from "./flow-editor";
import TaskMenu from "./task-menu";
import Topbar from "./topbar/top-bar";

const Editor = ({ workflow }: { workflow: Workflow }) => {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full overflow-hidden">
          <Topbar
            workflowId={workflow.id}
            name={workflow.name}
            description={workflow.description}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
};

export default Editor;
