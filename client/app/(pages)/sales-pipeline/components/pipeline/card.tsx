import { useEffect, useRef, useState } from "react";
import { Clock, Move } from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { usePhoneStore } from "@/hooks/use-phone";
import { usePipelineActions } from "@/hooks/pipeline/use-pipeline";
import { usePipelineStore } from "@/hooks/pipeline/use-pipeline-store";

import { FullPipeline, PipelineLead } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadCard } from "../lead-card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Actions } from "../actions";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { timeZones } from "@/constants/states";

type PipelineCardProps = {
  pipeline: FullPipeline;
  idx: number;
  initLeads: PipelineLead[];
  loading?: boolean;
};
export const PipelineCard = ({
  pipeline,
  idx,
  initLeads,
  loading = false,
}: PipelineCardProps) => {
  const { setSelectedPipeline } = usePipelineStore();
  const { onPhoneDialerOpen } = usePhoneStore();
  const { onPipelineUpdateIndexSubmit } = usePipelineActions();
  const [timeZone, setTimeZone] = useState("%");
  const [leads, setLeads] = useState(initLeads);
  const [index, setIndex] = useState(idx);

  const divRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();

  const onReset = () => {
    setIndex(0);
    onPipelineUpdateIndexSubmit(pipeline.id, 0);
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
      drag="x"
    >
      <section className="flex flex-col  shadow-xl h-[400px]">
        <SkeletonWrapper isLoading={loading} fullHeight fullWidth>
          <div className="flex justify-between items-center bg-primary/25 text-primary px-2">
            <div className="flex flex-1 items-center gap-2">
              <Button
                size="icon"
                variant="transparent"
                onPointerDown={(e) => controls.start(e)}
              >
                <Move size={15} />
              </Button>
              <p className="font-bold">{pipeline.name}</p>
            </div>
            <Actions pipelineId={pipeline.id} onReset={onReset} />
          </div>
          <div className="p-1">
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
          </div>
          <div className="flex justify-between items-center border-b p-2">
            <Button
              variant="gradientDark"
              size="sm"
              disabled={!leads.length}
              onClick={() => {
                setSelectedPipeline(pipeline, timeZone);
                onPhoneDialerOpen();
              }}
            >
              START DIALING
            </Button>
            <p>Leads: {leads.length}</p>
          </div>

          <ScrollArea className="relative group h-full" ref={divRef}>
            {leads.map((lead, i) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                indexRef={i == index ? indexRef : null}
              />
            ))}
          </ScrollArea>
        </SkeletonWrapper>
      </section>
    </Reorder.Item>
  );
};
