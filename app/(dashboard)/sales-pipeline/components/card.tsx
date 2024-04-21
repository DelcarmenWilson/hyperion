import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { LeadCard } from "./lead-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FullLead } from "@/types";
import { Actions } from "./actions";
import { PipeLine } from "@prisma/client";
import { usePhoneModal } from "@/hooks/use-phone-modal";
import { pipelineUpdateByIdIndex } from "@/actions/pipeline";

type PipelineCardProps = {
  pipeline: PipeLine;
  leads: FullLead[];
  sendPipeline: (e: PipeLine, type: string) => void;
};
export const PipelineCard = ({
  pipeline,
  leads,
  sendPipeline,
}: PipelineCardProps) => {
  const { onPhoneDialerOpen } = usePhoneModal();
  const [index, setIndex] = useState(pipeline.index);
  const indexRef = useRef<HTMLDivElement>(null);

  const onReset = () => {
    setIndex(0);
    pipelineUpdateByIdIndex(pipeline.id, 0);
  };

  // useEffect(() => {
  //   if (!indexRef.current) return;
  //   indexRef.current.scrollIntoView({
  //     behavior: "smooth",
  //     block: "end",
  //     inline: "nearest",
  //   });
  // }, [index]);
  return (
    <section className="flex flex-col gap-2 glassmorphism border border-primary/50 shadow-inner h-[400px]">
      <div className="bg-primary text-background flex justify-between items-center px-2">
        <p>{pipeline.name}</p>
        <Actions
          pipeline={pipeline}
          sendPipeline={sendPipeline}
          onReset={onReset}
        />
      </div>
      {/* <Select>
        <SelectTrigger>
          <Clock size={16} />
          <SelectValue placeholder="Filter Timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="East">East</SelectItem>
          <SelectItem value="West">West</SelectItem>
          <SelectItem value="North">North</SelectItem>
          <SelectItem value="South">South</SelectItem>
        </SelectContent>
      </Select> */}
      <div className="flex justify-between items-center border-b px-2">
        <Button
          size="sm"
          disabled={!leads.length}
          onClick={() => onPhoneDialerOpen(leads, pipeline)}
        >
          START DIALING
        </Button>
        <p>Leads: {leads.length}</p>
      </div>
      <ScrollArea>
        {leads.map((lead, i) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            indexRef={i == index ? indexRef : null}
          />
        ))}
      </ScrollArea>
    </section>
  );
};
