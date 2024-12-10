"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useImageViewerStore } from "@/stores/image-viewer-store";
import {
  useAgentTemplateData,
  useAgentTemplateActions,
} from "../../hooks/use-template";

import { UserTemplate } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import DeleteDialog from "@/components/custom/delete-dialog";
import { EmptyData } from "@/components/lead/info/empty-data";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import TemplateDrawer from "./drawer";

import { formatDate } from "@/formulas/dates";

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

type TemplateCardProps = {
  template: UserTemplate;
  onSelect?: (tp: UserTemplate) => void;
};
const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  const { onDeleteTemplate, templateDeleting } = useAgentTemplateActions();
  const { onOpen } = useImageViewerStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TemplateDrawer
        template={template}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <Card className="flex flex-col hover:bg-accent">
        <CardHeader>
          <CardTitle className="text-primary text-2xl text-center">
            {template.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 overflow-hidden text-sm">
          <div className="grid grid-cols-3 gap-2 overflow-y-auto">
            <div
              className={cn(
                "flex flex-col gap-2 col-span-2",
                !template.attachment && "col-span-3"
              )}
            >
              <p className="text-muted-foreground">Message:</p>
              <p className="font-bold overflow-ellipsis line-clamp-4">
                {template.message}
              </p>
              <p className="text-muted-foreground">Description:</p>
              <p className="font-bold">{template.description}</p>

              <p className="text-muted-foreground">Date Created:</p>
              <p>{formatDate(template.createdAt)}</p>
            </div>

            {template.attachment && (
              <div className="flex-center">
                <Image
                  height={100}
                  width={100}
                  className="w-20 h-20 border cursor-pointer hover:border-primary"
                  onClick={() => onOpen(template.attachment, template.name)}
                  loading="lazy"
                  priority={false}
                  src={template.attachment}
                  alt={template.name}
                />
              </div>
            )}
          </div>
        </CardContent>

        {onSelect ? (
          <Button
            className="mt-auto"
            variant="outlineprimary"
            size="sm"
            onClick={() => onSelect(template)}
          >
            Select
          </Button>
        ) : (
          <CardFooter className="flex group gap-2 justify-end items-center mt-auto">
            <DeleteDialog
              title="Are your sure you want to delete this carrier?"
              btnClass="opacity-0 group-hover:opacity-100 w-fit"
              cfText={template.name}
              onConfirm={() => onDeleteTemplate(template.id)}
              loading={templateDeleting}
            />

            <Button onClick={() => setIsOpen(true)}>Edit</Button>
          </CardFooter>
        )}
      </Card>
    </>
  );
};
