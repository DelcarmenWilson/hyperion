import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";

import { chatbotGetActive, chatbotSettingsUpsert } from "@/actions/chat-bot/chatbot";
import {
  ChatbotSettingsSchema,
  ChatbotSettingsSchemaType,
} from "@/schemas/chat-bot/chatbot";
import { Script } from "@prisma/client";
import {
  scriptGetById,
  scriptsGetAll,
  scriptInsert,
  scriptUpdateById,
  scriptDeleteById,
} from "@/actions/script";
import { ScriptSchemaType } from "@/schemas/admin";

type ScriptStore = {
  scriptId?: string;
  setScriptId: (s?: string) => void;
  isScriptFormOpen: boolean;
  onScriptFormOpen: (e?: string) => void;
  onScriptFormClose: () => void;
};

export const useScriptStore = create<ScriptStore>((set) => ({
  setScriptId: (a) => set({ scriptId: a }),
  isScriptFormOpen: false,
  onScriptFormOpen: (e) => set({ scriptId: e, isScriptFormOpen: true }),
  onScriptFormClose: () => set({ isScriptFormOpen: false }),
}));

export const useScriptData = () => {
  const { scriptId, setScriptId } = useScriptStore();

  const { data: scripts, isFetching: isFetchingScripts } = useQuery<
    Script[] | []
  >({
    queryFn: () => scriptsGetAll(),
    queryKey: ["admin-scripts"],
  });

  const { data: script, isFetching: isFetchingScript } =
    useQuery<Script | null>({
      queryFn: () => scriptGetById(scriptId as string),
      queryKey: [`admin-script-${scriptId}`],
    });

  useEffect(() => {
    if (!scripts) return;
    setScriptId(scripts[0].id);
  }, [scripts]);

  return {
    scriptId,
    setScriptId,
    scripts,
    isFetchingScripts,
    script,
    isFetchingScript,
  };
};

export const useScriptActions = () => {
  const { setScriptId } = useScriptStore();
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-scripts"] });
  };

  const { mutate: scriptDelete, isPending: isPendingScriptDelete } =
    useMutation({
      mutationFn: scriptDeleteById,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Script deleted!", { id: "delete-script" });
          invalidate();
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const onScriptDelete = useCallback(
    (id: string) => {
      toast.loading("Deleteing Script...", { id: "delete-script" });

      scriptDelete(id);
    },
    [scriptDelete]
  );

  const { mutate: scriptMutateInsert, isPending: isPendingScriptInsert } =
    useMutation({
      mutationFn: scriptInsert,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("New Script Created!!", {
            id: "insert-script",
          });
          invalidate();
          setScriptId(result.success.id);
        } else toast.error(result.error);
      },
      onError: (error) => {
        toast.error(error.message, { id: "insert-script" });
      },
    });

  const onScriptInsert = useCallback(() => {
    toast.loading("creating new script...", { id: "insert-script" });
    scriptMutateInsert();
  }, [scriptMutateInsert]);

  const { mutate: scriptUpdate, isPending: isPendingScriptUpdate } =
    useMutation({
      mutationFn: scriptUpdateById,
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Script Updated!!", {
            id: "update-script",
          });
          invalidate();
        } else toast.error(result.error);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onScriptUpdate = useCallback(
    (values: ScriptSchemaType) => {
      toast.loading("Updating script...", { id: "update-script" });
      scriptUpdate(values);
    },
    [scriptUpdate]
  );

  return {
    alertOpen,
    setAlertOpen,
    onScriptDelete,
    isPendingScriptDelete,
    onScriptInsert,
    isPendingScriptInsert,
    onScriptUpdate,
    isPendingScriptUpdate,
  };
};
