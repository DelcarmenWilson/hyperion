"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useImageViewer } from "@/hooks/use-image-viewer";
import { useAgentTemplateActions } from "../../hooks/user-template";

import { UserTemplate } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer/right";
import { AlertModal } from "@/components/modals/alert";

import { TemplateForm } from "./form";

import { formatDate } from "@/formulas/dates";

type TemplateCardProps = {
  template: UserTemplate;
  onSelect?: (tp: UserTemplate) => void;
};
export const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  const { alertOpen, setAlertOpen, onTemplateDelete, isPendingTemplateDelete } =
    useAgentTemplateActions();
  const { onOpen } = useImageViewer();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => onTemplateDelete(template.id)}
        loading={isPendingTemplateDelete}
        height="auto"
      />
      <DrawerRight
        title="Edit Template"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <TemplateForm template={template} onClose={() => setIsOpen(false)} />
      </DrawerRight>
      <div className="flex flex-col max-h[100px] gap-2 border hover:bg-secondary  text-sm p-2 overflow-hidden">
        <h2 className="text-primary text-2xl text-center">{template.name}</h2>
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
          <div className="flex group gap-2 justify-end items-center mt-auto border-t pt-2">
            <Button
              variant="destructive"
              className="opacity-0 group-hover:opacity-100"
              onClick={() => setAlertOpen(true)}
            >
              Delete
            </Button>
            <Button onClick={() => setIsOpen(true)}>Edit</Button>
          </div>
        )}
      </div>
    </>
  );
};
