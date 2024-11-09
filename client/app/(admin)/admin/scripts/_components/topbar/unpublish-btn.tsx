"use client";
import React from "react";
import { PauseIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { unPublishScript } from "@/actions/script/unpublish-script";

const UnPublishBtn = ({ scriptId }: { scriptId: string }) => {
  const mutation = useMutation({
    mutationFn: unPublishScript,
    onSuccess: () =>
      toast.success("Script unpublished", { id: "unpublish-script" }),
    onError: () =>
      toast.error("Something went worng", { id: "unpublish-script" }),
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Unpublishing script...", { id: "unpublish-script" });
        mutation.mutate({
          id: scriptId,
        });
      }}
    >
      <PauseIcon size={16} className="stroke-red-400" />
      Unpublish
    </Button>
  );
};

export default UnPublishBtn;
