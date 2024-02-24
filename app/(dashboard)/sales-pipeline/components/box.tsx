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
import { LeadBox } from "./lead-box";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FullLead } from "@/types";
import { Actions } from "./actions";
import { PipeLine } from "@prisma/client";
import { useState } from "react";

type BoxProps = {
  pipeline: PipeLine;
  leads: FullLead[];
  sendPipeline: (e: PipeLine, type: string) => void;
};
export const Box = ({ pipeline, leads, sendPipeline }: BoxProps) => {
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
            <Clock className="w-4 h-4" />
            <SelectValue placeholder="Filter Timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="East">Esat</SelectItem>
            <SelectItem value={"West"}>West</SelectItem>
            <SelectItem value="North">North</SelectItem>
            <SelectItem value={"South"}>South</SelectItem>
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
          <LeadBox
            key={lead.id}
            bg={i == index ? "bg-secondary" : ""}
            lead={lead}
          />
        ))}
      </ScrollArea>
    </section>
  );
};
