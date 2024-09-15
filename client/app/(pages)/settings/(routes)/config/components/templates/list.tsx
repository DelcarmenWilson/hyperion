"use client";
import { cn } from "@/lib/utils";
import { useAgentTemplateData } from "../../hooks/user-template";
import { UserTemplate } from "@prisma/client";

import { EmptyData } from "@/components/lead/info/empty-data";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TemplateCard } from "./card";

type TemplateListProps = {
  size?: string;
  onSelect?: (tp: UserTemplate) => void;
};
export const TemplateList = ({
  size = "full",
  onSelect,
}: TemplateListProps) => {
  const { templates, isFetchingTemplates } = useAgentTemplateData();
  return (
    <SkeletonWrapper isLoading={isFetchingTemplates}>
      {templates?.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        <EmptyData title="No templates found" />
      )}
    </SkeletonWrapper>
  );
};
