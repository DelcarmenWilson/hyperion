"use client";
import { Button } from "@/components/ui/button";
import { Script } from "@prisma/client";
import { useState } from "react";
import { ScriptForm } from "./script-form";
import { Plus } from "lucide-react";

type ScriptsClientProps = {
  intialScripts: Script[];
};
export const ScriptsClient = ({ intialScripts }: ScriptsClientProps) => {
  const [scripts, setScripts] = useState<Script[] | null>(intialScripts);
  const [selected, setSelected] = useState<Script | null>(intialScripts[0]);

  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-2">
      <div className="flex flex-col w-full lg:w-[30%] lg:h-full gap-2 border-r px-4">
        <div className="flex justify-between items-center gap-2">
          <h4 className="text-xl font-semibold">Scripts</h4>
          <Button onClick={() => setSelected(null)}>
            <Plus size={16} className="mr-2" /> New
          </Button>
        </div>
        {scripts?.map((script) => (
          <Button
            key={script.id}
            variant={script.id == selected?.id ? "default" : "ghost"}
            onClick={() => setSelected(script)}
          >
            {script.title}
          </Button>
        ))}
      </div>
      <ScriptForm script={selected} setScripts={setScripts} />
    </div>
  );
};
