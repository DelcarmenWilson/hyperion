"use client";
import { useRouter } from "next/navigation";
import { FullPipeline } from "@/types";
import { FullLead } from "@/types";

import { EmptyCard } from "@/components/reusable/empty-card";
import { PipeLineList } from "./pipeline/list";

type SaleClientProps = {
  leads: FullLead[];
  pipelines: FullPipeline[];
};

export const SalesClient = ({ leads, pipelines }: SaleClientProps) => {
  return (
    <>
      {pipelines.length > 1 ? (
        <PipeLineList leads={leads} initPipelines={pipelines} />
      ) : (
        <EmptyCard
          title="No Stages Available"
          subTitle="Please add a new stage"
        />
      )}
    </>
  );
};
