import { useEffect, useRef, useState } from "react";
import { Clock, Move } from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { usePhoneStore } from "@/stores/phone-store";
import { usePipelineActions } from "@/hooks/pipeline/use-pipeline";
import { usePipelineStore } from "@/stores/pipeline-store";

import { FullPipeline, PipelineLead } from "@/types";

import { Actions } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadCard } from "../lead-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const { onPhoneDialerOpen } = usePhoneStore();
  const { setSelectedPipeline } = usePipelineStore();
  const { onUpdatePipelineUpdateIndex } = usePipelineActions();
  const [timeZone, setTimeZone] = useState("%");
  const [leads, setLeads] = useState(initLeads);
  const [index, setIndex] = useState(idx);

  const divRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();

  const onReset = () => {
    setIndex(0);
    onUpdatePipelineUpdateIndex(pipeline.id, 0);
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
      <Card className="flex flex-col  shadow-xl h-[450px] overflow-hidden">
        <SkeletonWrapper isLoading={loading} fullHeight fullWidth>
          <CardHeader className="flex flex-row justify-between items-center bg-primary/25 text-primary p-1">
            <div className="flex flex-1 items-center gap-2">
              <Button
                size="icon"
                variant="transparent"
                onPointerDown={(e) => controls.start(e)}
              >
                <Move size={15} />
              </Button>
              <CardTitle className="font-bold">{pipeline.name}</CardTitle>
            </div>
            <Actions pipeline={pipeline} onReset={onReset} />
          </CardHeader>
        </SkeletonWrapper>
        <CardContent className="flex-1 flex flex-col h-full overflow-hidden !p-0">
          <SkeletonWrapper isLoading={loading} fullHeight fullWidth>
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
        </CardContent>
      </Card>
    </Reorder.Item>
  );
};
