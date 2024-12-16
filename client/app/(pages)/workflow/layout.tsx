import React, { ReactNode } from "react";
import Logo from "@/components/logo";
import { ModeToggle } from "@/components/theme-mode-toggle";
import { Separator } from "@/components/ui/separator";
import { TextAnimation } from "@/components/custom/text-animate";

const WorkflowLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col wfull h-screen">
      {children}

      <Separator />
      <footer className="flex items-center justify-between p-2">
        <div className="flex  items-center gap-1">
          <Logo iconSize={16} fontSize="text-xl" />
          <span> - </span>
          <TextAnimation
            text="Workflow Editor"
            textAnchor="left"
            viewBox="0 0 700 160"
            x="0"
            y="70%"
          />
        </div>
        <ModeToggle />
      </footer>
    </div>
  );
};

export default WorkflowLayout;
