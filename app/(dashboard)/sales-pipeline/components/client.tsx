"use client";
import { UserSquare } from "lucide-react";
import { Box } from "./box";
import { FullLead, FullPipeline } from "@/types";
import { PageLayout } from "@/components/custom/page-layout";
import { TopMenu } from "./top-menu";
import { PipeLine } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { toast } from "sonner";
import { pipelineDeleteById } from "@/actions/pipeline";

type SaleClientProps = {
  data: FullLead[];
  pipelines: FullPipeline[];
};

export const SalesClient = ({ data, pipelines }: SaleClientProps) => {
  const router = useRouter();
  const [pipeline, setPipeline] = useState<PipeLine>();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const sendPipeline = (e: PipeLine) => {
    setPipeline(e);
    setAlertOpen(true);
  };
  const onDelete = () => {
    if (!pipeline) return;
    setLoading(true);
    toast.success(JSON.stringify(pipeline));
    pipelineDeleteById(pipeline.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        router.refresh();
        toast.success(data.success);
      }
    });
    setAlertOpen(false);
    setLoading(false);
  };
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        height="h-auto"
      />
      <PageLayout
        title="Sales Pipeline"
        icon={UserSquare}
        topMenu={<TopMenu />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {pipelines?.map((pipeline) => (
            <Box
              key={pipeline.id}
              pipeline={pipeline}
              sendPipeline={sendPipeline}
              leads={data.filter((e) => e.status == pipeline.status.status)}
            />
          ))}
        </div>
      </PageLayout>
    </>
  );
};
