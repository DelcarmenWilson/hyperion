import { generateText } from "@/actions/ai-generator/generate-text";
import {  parseJson } from "@/lib/helper/json-parser";
import { AiGeneratorResponse } from "@/types/ai-generator";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

//TODO dont forget to remove this and be sent in from the components that uses this feture
const samplePrompt =
  "Generate a custom text message that involves a starter conversation between a life insurance agent  and a lead . Please keep it short and sweet";

type State = {
  isAiGeneratorOpen: boolean;
  prompt: string;
  keyword:boolean
  quantity: string;
  responses?: AiGeneratorResponse[];
  responseSelectedCb?: (e: string) => void;
};

type Actions = {
  onAiGeneratorOpen: (cb:(e:string)=>void) => void;
  onAiGeneratorClose: () => void;
  setPrompt: (p: string) => void;
  setKeyword:(k:boolean)=>void
  setQuantity: (q: string) => void;
  setResponses: (r?: AiGeneratorResponse[]) => void;
};

export const useAiGeneratorStore = create<State & Actions>()(
  immer((set) => ({
    isAiGeneratorOpen: false,
    prompt: samplePrompt,
    keyword:true,
    quantity: "1",loading:false,
    onAiGeneratorOpen: (cb) => set({ isAiGeneratorOpen: true,responseSelectedCb:cb }),
    onAiGeneratorClose: () => set({ isAiGeneratorOpen: false,responseSelectedCb:undefined }),
    setPrompt: (p) => set({ prompt: p }),
    setKeyword: (k) => set({ keyword: k }),
    setQuantity: (q) => set({ quantity: q }),
    setResponses: (r) => set({ responses: r }),
  }))
);

export const useAiGeneratorActions = (onClose?: () => void) => {
  const { prompt,keyword, quantity, setResponses } = useAiGeneratorStore();

  //TODO DELETE
  const { mutate: aiTextGenerateMutate, isPending: aiTextGenerating } =
    useMutation({
      mutationFn: generateText,
      onSuccess: (results) => {
        toast.success("Text Generated", { id: "generate-text" });
         setResponses(results);
      },
      onError: () =>
        toast.error("Failed to generate text", { id: "generate-text" }),
    });

  const onGenerateText = useCallback(() => {
    toast.loading("Generating text", { id: "generate-text" });
    setResponses(undefined);
    aiTextGenerateMutate({ prompt,keyword, quantity: parseInt(quantity) });
  }, [aiTextGenerateMutate, prompt,keyword,quantity]);

  return {
    onGenerateText,
    aiTextGenerating,
  };
};
