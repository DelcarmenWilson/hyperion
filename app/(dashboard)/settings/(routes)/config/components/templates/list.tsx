"use client";
import { cn } from "@/lib/utils";
import { TemplateCard } from "./card";
import { UserTemplate } from "@prisma/client";

type TemplateListProps = {
  templates: UserTemplate[];
  size?: string;
  showSelect?: boolean;
};
export const TemplateList = ({
  templates,
  size = "full",
  showSelect = false,
}: TemplateListProps) => {
  return (
    <>
      {templates.length ? (
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
              showSelect={showSelect}
            />
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Templates Found</p>
        </div>
      )}
    </>
  );
};
