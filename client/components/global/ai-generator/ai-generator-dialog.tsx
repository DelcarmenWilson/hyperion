"use client";
import {
  useAiGeneratorActions,
  useAiGeneratorStore,
} from "@/hooks/ai-generator/use-ai-generator";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import { CustomDialog } from "@/components/global/custom-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AiGeneratorSidebar from "./sidebar";
import ResponseList from "./response-list";
import { Switch } from "@/components/ui/switch";

export const AiGeneratorDialog = () => {
  const {
    isAiGeneratorOpen,
    onAiGeneratorClose,
    prompt,
    setPrompt,
    quantity,
    keyword,
    setKeyword,
    setQuantity,
    responses,
  } = useAiGeneratorStore();

  const onKeyworkSelected = (e: string) => {
    setPrompt(prompt + ` ${e}`);
  };

  const { onGenerateText, aiTextGenerating } = useAiGeneratorActions();

  return (
    <CustomDialog
      title="Text Generator"
      description="Generate text using Titan"
      showDescription
      maxWidth
      maxHeight
      scroll={false}
      open={isAiGeneratorOpen}
      onClose={onAiGeneratorClose}
    >
      <div className="flex gap-2 h-full w-full overflow-hidden">
        <div className="flex-1 flex flex-col h-full overflow-y-auto gap-2 p-2">
          <div className="flex w-full justify-between items-center">
            <div className="flex justify-between items-center gap-x-4 border rounded-lg px-3">
              <div>
                <p className="font-bold text-sm">Include Keywords</p>
                <span className="text-xs text-muted-foreground">
                  Include the keywords in the prompt
                </span>
              </div>
              <Switch checked={keyword} onCheckedChange={setKeyword} />
            </div>
            <div className="w-[50px]">
              <p className="text-muted-foreground text-sm ">Quantity</p>
              <Select
                name="ddlQuantity"
                defaultValue={quantity}
                onValueChange={setQuantity}
                disabled={aiTextGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Quantity" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4", "5"].map((ct) => (
                    <SelectItem key={ct} value={ct}>
                      {ct}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-full">
            <p className="text-muted-foreground text-sm ">Prompt</p>
            <Textarea
              value={prompt}
              placeholder="Type Prompt"
              disabled={aiTextGenerating}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
            />
            <div className="grid grid-cols-2 mt-2 gap-2">
              <Button variant="outline" onClick={onAiGeneratorClose}>
                Cancel
              </Button>
              <Button
                onClick={onGenerateText}
                disabled={!prompt || aiTextGenerating}
              >
                {responses ? "Re-Generate" : "Generate"}
              </Button>
            </div>
          </div>
          <ResponseList loading={aiTextGenerating} />
        </div>
        <AiGeneratorSidebar onSelect={onKeyworkSelected} />
      </div>
    </CustomDialog>
  );
};
