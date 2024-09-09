import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";

import { chatbotGetActive, chatbotSettingsUpsert } from "@/actions/chatbot";
import {
  ChatbotSettingsSchema,
  ChatbotSettingsSchemaType,
} from "@/schemas/chatbot";
import { Script } from "@prisma/client";
import {
  scriptGetById,
  scriptsGetAll,
  scriptInsert,
  scriptUpdateById,
} from "@/actions/script";
import { ScriptSchemaType } from "@/schemas/admin";

type useScriptStore = {
  scriptId?: string;
  setScriptId: (s?: string) => void;
};

export const useScript = create<useScriptStore>((set) => ({
  setScriptId: (a) => set({ scriptId: a }),
}));

export const useScriptData = () => {
  const { scriptId, setScriptId } = useScript();

  const { data: scripts, isFetching: isFetchingScripts } = useQuery<
    Script[] | []
  >({
    queryFn: () => scriptsGetAll(),
    queryKey: ["adminScripts"],
  });

  const { data: script, isFetching: isFetchingScript } =
    useQuery<Script | null>({
      queryFn: () => scriptGetById(scriptId as string),
      queryKey: [`adminScript-${scriptId}`],
    });

  useEffect(() => {
    if (scripts) {
      setScriptId(scripts[0].id);
    }
  }, []);

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
  const [loading, setLoading] = useState(false);
  const { setScriptId } = useScript();
  const queryClient = useQueryClient();

  const onScriptInsert = async () => {
    setLoading(true);
    const insertedScript = await scriptInsert();
    if (insertedScript.success) {
      queryClient.invalidateQueries({ queryKey: ["adminScripts"] });
      setScriptId(insertedScript.success.id);
      toast.success("Script Inserted");
    } else toast.error(insertedScript.error);
    setLoading(false);
  };

  const onScriptUpdate = async (values: ScriptSchemaType) => {
    setLoading(true);
    const updatedScript = await scriptUpdateById(values);
    if (updatedScript.success) {
      queryClient.invalidateQueries({ queryKey: ["adminScripts"] });
      toast.success("Script Updated!");
    } else toast.error(updatedScript.error);
    setLoading(false);
  };

  return {
    loading,
    onScriptInsert,
    onScriptUpdate,
  };
};
