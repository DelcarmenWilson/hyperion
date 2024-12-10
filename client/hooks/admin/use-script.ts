import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "../use-invalidate";
import { useScriptStore } from "@/stores/script-store";
import { toast } from "sonner";

import { Script } from "@prisma/client";
import {
  getScript,
  getScripts,
  createScript,
  updateScript,
  deleteScript,
} from "@/actions/script";
import { ScriptSchemaType } from "@/schemas/admin";

export const useScriptData = () => {
  const { scriptId, setScriptId } = useScriptStore();

  const onGetScripts = () => {
    const {
      data: scripts,
      isFetching: scriptsFetching,
      isLoading: scriptsLoading,
    } = useQuery<Script[] | []>({
      queryFn: () => getScripts(),
      queryKey: ["admin-scripts"],
    });
    return {
      scripts,
      scriptsFetching,
      scriptsLoading,
    };
  };
  const onGetScript = () => {
    const {
      data: script,
      isFetching: scriptFetching,
      isLoading: scriptLoading,
    } = useQuery<Script | null>({
      queryFn: () => getScript(scriptId as string),
      queryKey: [`admin-script-${scriptId}`],
      enabled: !!scriptId,
    });
    return {
      script,
      scriptFetching,
      scriptLoading,
    };
  };

  // useEffect(() => {
  //   if (!scripts || scripts.length==0) return;
  //   setScriptId(scripts[0].id);
  // }, [scripts]);

  return {
    onGetScripts,
    onGetScript,
  };
};

export const useScriptActions = () => {
  const { setScriptId } = useScriptStore();
  const { invalidate } = useInvalidate();

  const { mutate: createScriptMutate, isPending: scriptCreating } = useMutation(
    {
      mutationFn: createScript,
      onSuccess: (results) => {
        toast.success("New Script Created!!", {
          id: "insert-script",
        });
        invalidate("admin-scripts");
        setScriptId(results.id);
      },
      onError: (error) => {
        toast.error(error.message, { id: "insert-script" });
      },
    }
  );

  const onCreateScript = useCallback(() => {
    toast.loading("creating new script...", { id: "insert-script" });
    createScriptMutate();
  }, [createScriptMutate]);

  const { mutate: deleteScriptMutate, isPending: scriptDeleting } = useMutation(
    {
      mutationFn: deleteScript,
      onSuccess: () =>
        toast.success("Script deleted successfully", { id: "delete-script" }),
      onError: () =>
        toast.error("Something went wrong", { id: "delete-script" }),
    }
  );
  const onDeleteScript = useCallback(
    (id: string) => {
      toast.loading("Deleting Script...", { id: "delete-script" });
      deleteScriptMutate(id);
    },
    [deleteScriptMutate]
  );

  const { mutate: updateScriptMutate, isPending: scriptUpdating } = useMutation(
    {
      mutationFn: updateScript,
      onSuccess: () => {
        toast.success("Script Updated!!", {
          id: "update-script",
        });
        invalidate("admin-scripts");
      },
      onError: (error) =>
        toast.error(error.message, {
          id: "update-script",
        }),
    }
  );

  const onUpdateScript = useCallback(
    (values: ScriptSchemaType) => {
      toast.loading("Updating script...", { id: "update-script" });
      updateScriptMutate(values);
    },
    [updateScriptMutate]
  );

  return {
    onCreateScript,
    scriptCreating,
    onDeleteScript,
    scriptDeleting,
    onUpdateScript,
    scriptUpdating,
  };
};
