import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Clock } from "lucide-react";
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
import { usePhone } from "@/hooks/use-phone";
import { pipelineUpdateByIdIndex } from "@/actions/pipeline";
import { timeZones } from "@/constants/states";

type PipelineCardProps = {
  pipeline: PipeLine;
  initLeads: FullLead[];
  sendPipeline: (e: PipeLine, type: string) => void;
};
export const PipelineCard = ({
  pipeline,
  initLeads,
  sendPipeline,
}: PipelineCardProps) => {
  const { onPhoneDialerOpen } = usePhone();
  const [leads, setLeads] = useState(initLeads);
  const [index, setIndex] = useState(pipeline.index);

  const divRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const setTimezone = (timeZone: string) => {
    setLeads(
      timeZone == "%" ? initLeads : initLeads.filter((e) => e.zone == timeZone)
    );
  };
  const onReset = () => {
    setIndex(0);
    pipelineUpdateByIdIndex(pipeline.id, 0);
  };

  // const onScrollToggle = (dir: String) => {
  //   if (!indexRef.current && !divRef.current) return;
  //   let currentScroll = divRef.current?.scrollTop!;
  //   let height = indexRef.current?.offsetHeight!;
  //   const nextScroll =
  //     dir == "up" ? currentScroll - height : currentScroll + height;
  //   divRef.current?.scrollTo(0, nextScroll);
  // };
  // useEffect(() => {
  //   if (!indexRef.current && !divRef.current) return;

  //   divRef.current?.scrollTo(0, indexRef.current?.offsetTop! - 15);
  // }, [index]);
  return (
    <section className="flex flex-col border border-primary/50 shadow-inner h-[400px]">
      <div className="bg-primary text-background flex justify-between items-center px-2">
        <p>{pipeline.name}</p>
        <Actions
          pipeline={pipeline}
          sendPipeline={sendPipeline}
          onReset={onReset}
        />
      </div>
      <Select onValueChange={setTimezone} defaultValue="%">
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
        {/* {leads.length > 4 && (
          <div className="fixed bottom-2 z-10 left-[50%] flex flex-col items-center -translate-x-1/2 opacity-0 group-hover:opacity-100 gap-1">
            <Button
              className="rounded-full"
              size="icon"
              variant="outlineprimary"
              onClick={() => onScrollToggle("up")}
            >
              <ArrowUp size={14} />
              <span className="sr-only">Scroll Up</span>
            </Button>
            <Button
              className="rounded-full"
              size="icon"
              variant="outlineprimary"
              onClick={() => onScrollToggle("down")}
            >
              <ArrowDown size={14} />
              <span className="sr-only">Scroll Down</span>
            </Button>
          </div>
        )} */}
      </div>
    </section>
  );
};
