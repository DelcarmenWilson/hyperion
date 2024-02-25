"use client";
import { useEffect, useState } from "react";
import { Save, SaveAll } from "lucide-react";
import { toast } from "sonner";

import CKeditor from "@/components/reusable/ckeditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { scriptInsert, scriptUpdateById } from "@/actions/scripts";
import { Script } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";

type ScriptFormProps = {
  script: Script | null;
  setScripts?: React.Dispatch<React.SetStateAction<Script[] | null>>;
};

export const ScriptForm = ({ script, setScripts }: ScriptFormProps) => {
  const [loading, setLoading] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [title, setTitle] = useState(script?.title || "");
  const [data, setData] = useState(script?.script || "");

  const buttonText = script ? "Update" : "Save";

  const onSave = () => {
    if (!data || !title) {
      toast.error("Invalid Data");
      return;
    }
    setLoading(true);
    if (!script) {
      scriptInsert(title, data).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          if (setScripts) {
            setScripts((scripts) => {
              return [...scripts!, data.success];
            });
          }
          toast.success("Script created!");
        }
      });
    } else {
      scriptUpdateById(script.id, title, data).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          console.log(data.success);
          toast.success("Scipt Updated!");
        }
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    setEditorLoaded(true);
  }, [script]);

  return (
    <div className="flex flex-col h-full pl-1 overflow-hidden">
      <div className="flex justify-between items-end mb-2 gap-4">
        <div className="w-full">
          <p>Script Name</p>
          <Input
            className="w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <Button disabled={loading} onClick={onSave}>
          {script ? (
            <SaveAll size={16} className="mr-2" />
          ) : (
            <Save size={16} className="mr-2" />
          )}

          {buttonText}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <CKeditor
          name="scripts"
          onChange={(data: string) => {
            setData(data);
          }}
          value={data}
          editorLoaded={editorLoaded}
        />
      </ScrollArea>
    </div>
  );
};
