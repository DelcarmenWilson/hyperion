import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Move } from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadCard } from "../lead-card";
import { FullLead } from "@/types";
import { Actions } from "../actions";
import { PipeLine } from "@prisma/client";
import { usePhone } from "@/hooks/use-phone";
import { pipelineUpdateByIdIndex } from "@/actions/pipeline";
import { timeZones } from "@/constants/states";

type PipelineCardProps = {
  pipeline: PipeLine;
  idx: number;
  initLeads: FullLead[];
  sendPipeline: (e: PipeLine, type: string) => void;
};
export const PipelineCard = ({
  pipeline,
  idx,
  initLeads,
  sendPipeline,
}: PipelineCardProps) => {
  const { onPhoneDialerOpen } = usePhone();
  const [timeZone, setTimeZone] = useState("%");
  const [leads, setLeads] = useState(initLeads);
  const [index, setIndex] = useState(pipeline.index);

  const divRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();

  const onReset = () => {
    setIndex(0);
    pipelineUpdateByIdIndex(pipeline.id, 0);
  };

  useEffect(() => {
    setLeads(
      timeZone == "%" ? initLeads : initLeads.filter((e) => e.zone == timeZone)
    );
  }, [initLeads, timeZone]);
  return (
    <Reorder.Item
      value={pipeline}
      dragListener={false}
      dragControls={controls}
      drag
    >
      <section className="flex flex-col border border-primary/50 shadow-inner h-[400px]">
        <div className="flex justify-between items-center bg-primary text-background px-2">
          <div className="flex flex-1 items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onPointerDown={(e) => controls.start(e)}
            >
              <Move size={15} />
            </Button>
            <p>{pipeline.name}</p>
          </div>
          <Actions
            pipeline={pipeline}
            sendPipeline={sendPipeline}
            onReset={onReset}
          />
        </div>
        <Select onValueChange={setTimeZone} defaultValue="%">
          <SelectTrigger>
            <Clock size={16} />
            <SelectValue placeholder="Filter Timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="%">Filter Timezone</SelectItem>
            {timeZones.map((timeZone) => (
              <SelectItem key={timeZone.value} value={timeZone.value}>
                {timeZone.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex justify-between items-center border-b p-2">
          <Button
            size="sm"
            disabled={!leads.length}
            onClick={() => onPhoneDialerOpen(leads, pipeline)}
          >
            START DIALING
          </Button>
          <p>Leads: {leads.length}</p>
        </div>
        <div className="relative group h-full overflow-y-auto" ref={divRef}>
          {leads.map((lead, i) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              indexRef={i == index ? indexRef : null}
            />
          ))}
        </div>
      </section>
    </Reorder.Item>
  );
};
