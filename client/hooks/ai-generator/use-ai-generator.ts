import { generateText } from "@/actions/ai-generator/generate-text";
import { useAiGeneratorStore } from "@/stores/ai-generator-store";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

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
