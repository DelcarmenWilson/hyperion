"use client";
import React from "react";
import { CheckIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateScript } from "@/actions/script/update-script";
import { useScriptStore } from "../../hooks/use-script-store";

const SaveBtn = ({ scriptId }: { scriptId: string }) => {
  const { content, script } = useScriptStore();
  const text = JSON.stringify(content);
  const saveMutation = useMutation({
    mutationFn: updateScript,
    onSuccess: () =>
      toast.success("Script saved succesfully", { id: "save-script" }),
    onError: () => toast.error("Something went worng", { id: "save-script" }),
  });
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={saveMutation.isPending || script?.content == text}
      onClick={() => {
        toast.loading("Saving script...", { id: "save-script" });
        saveMutation.mutate({
          id: scriptId,
          content: text,
        });
        // console.log(content);
      }}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
};

export default SaveBtn;
