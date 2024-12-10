"use client";
import React, { useEffect } from "react";
import { useScriptStore } from "@/stores/script-store";

import { Script } from "@prisma/client";
import { ScriptStatus } from "@/types/script";

import ScriptEditor from "./script-editor";
import TaskMenu from "./task-menu";
import Topbar from "./topbar/top-bar";

const Editor = ({ script }: { script: Script }) => {
  const { setScript } = useScriptStore();

  useEffect(() => {
    if (!script) return;
    setScript(script);
  }, [script]);
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        name={script.name}
        description={script.description}
        scriptId={script.id}
        isDraft={script.status == ScriptStatus.DRAFT}
      />
      <section className="flex h-full overflow-auto">
        <TaskMenu />
        <ScriptEditor />
      </section>
    </div>
  );
};

export default Editor;
