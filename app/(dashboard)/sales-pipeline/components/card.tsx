import { useState } from "react";
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
  const [index, setIndex] = useState(pipeline.index);
  return (
    <section className="flex flex-col gap-2 border border-primary h-[400px]">
      <div className="bg-primary text-background flex justify-between items-center gap-2 px-2">
        <p>{pipeline.name}</p>
        <Actions pipeline={pipeline} sendPipeline={sendPipeline} />
      </div>
      <div>
        <Select>
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
        </Select>
      </div>
      <div className="flex justify-between items-center gap-2 px-2">
        <Button>START DIALING</Button>
        <p>Total leads: {leads.length}</p>
      </div>
      <Separator className="my-2" />
      <ScrollArea>
        {leads.map((lead, i) => (
          <LeadCard
            key={lead.id}
            bg={i == index ? "bg-secondary" : ""}
            lead={lead}
          />
        ))}
      </ScrollArea>
    </section>
  );
};
