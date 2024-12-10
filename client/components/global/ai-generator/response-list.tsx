"use client";
import { useAiGeneratorStore } from "@/stores/ai-generator-store";

import { LoadingCard } from "@/components/reusable/loading-card";
import { EmptyCard } from "@/components/reusable/empty-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ResponseList = ({ loading }: { loading: boolean }) => {
  const { responses, responseSelectedCb, onAiGeneratorClose } =
    useAiGeneratorStore();
  if (loading) return <LoadingCard title="Generating" />;
  if (responses == undefined && !loading)
    return <EmptyCard title="Start Generating" />;
  return (
    <div className="flex flex-col gap-2 ">
      <p className="text-xl text-center font-bold">Choices</p>
      <span className="text-sm text-muted-foreground">
        Please select a choice or regenerate
      </span>
      {responses?.map((response, i) => (
        <div
          key={i}
          className="relative border border-separate w-full p-2 min-h-[50px] group"
        >
          <Badge
            variant="gradient"
            className="absolute -top-3 -left-3 rounded-full"
          >
            {i + 1}
          </Badge>
          <Button
            variant="outlineprimary"
            size="sm"
            className="absolute top-0 -right-0 opacity-0 group-hover:opacity-100"
            onClick={() => {
              if (responseSelectedCb) responseSelectedCb(response.message);
              onAiGeneratorClose();
            }}
          >
            Select
          </Button>
          <p className="text-sm font-semibold">{response.message}</p>
        </div>
      ))}
    </div>
  );
};

export default ResponseList;
