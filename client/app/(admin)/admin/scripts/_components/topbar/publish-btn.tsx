"use client";
import React from "react";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useScriptStore } from "@/stores/script-store";

import { Button } from "@/components/ui/button";
import { publishScript } from "@/actions/script/publish-script";

const PublishBtn = ({ scriptId }: { scriptId: string }) => {
  const { content, script } = useScriptStore();
  const text = JSON.stringify(content);
  const mutation = useMutation({
    mutationFn: publishScript,
    onSuccess: () =>
      toast.success("Script published", { id: "publish-script" }),
    onError: () =>
      toast.error("Something went worng", { id: "publish-script" }),
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={mutation.isPending || script?.content != text}
      onClick={() => {
        toast.loading("Publishing script...", { id: "publish-script" });
        mutation.mutate({
          id: scriptId,
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Publish
    </Button>
  );
};

export default PublishBtn;
