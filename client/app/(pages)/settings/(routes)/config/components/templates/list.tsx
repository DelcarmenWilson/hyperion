"use client";
import { cn } from "@/lib/utils";
import { useTemplateData } from "./hooks/user-templates";
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
  const { templates, isFetchingTemplates } = useTemplateData();
  return (
    <SkeletonWrapper isLoading={isFetchingTemplates}>
      {templates && templates.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              initTemplate={template}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        // <p className="font-semibold text-center">No Templates Found</p>
        <EmptyData title="No templates found" />
      )}
    </SkeletonWrapper>
  );
};
