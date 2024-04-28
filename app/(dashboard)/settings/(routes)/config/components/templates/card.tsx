"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { emitter } from "@/lib/event-emmiter";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { UserTemplate } from "@prisma/client";

import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { TemplateForm } from "./form";

import { userTemplateDeleteById } from "@/actions/user";
import { cn } from "@/lib/utils";
import axios from "axios";

type TemplateCardProps = {
  initTemplate: UserTemplate;
  showSelect?: boolean;
};
export const TemplateCard = ({
  initTemplate,
  showSelect,
}: TemplateCardProps) => {
  const [template, setTemplate] = useState(initTemplate);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteTemplate = () => {
    setLoading(true);

    userTemplateDeleteById(template.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        if (template.attachment) {
          axios.put("/api/upload/image", { oldFile: template.attachment });
        }
        emitter.emit("templateDeleted", template.id);
        toast.success(data.success);
      }
    });
    setAlertOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    setTemplate(initTemplate);
    const onTemplateUpdated = (e: UserTemplate) => {
      if (e.id == template.id) setTemplate(e);
    };
    emitter.on("templateUpdated", (info) => onTemplateUpdated(info));
  }, [initTemplate]);
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteTemplate}
        loading={loading}
        height="auto"
      />
      <DrawerRight
        title="Edit Template"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <TemplateForm template={template} onClose={() => setIsOpen(false)} />
      </DrawerRight>
      <div className="flex flex-col gap-2 border hover:bg-secondary text-sm p-2">
        <h2 className="text-primary text-2xl text-center">{template.name}</h2>
        <div className="grid grid-cols-3 gap-2">
          <div
            className={cn(
              "flex flex-col gap-2 col-span-2",
              !template.attachment && "col-span-3"
            )}
          >
            <p className="text-muted-foreground">Message:</p>
            <p className="font-bold">{template.message}</p>
            <p className="text-muted-foreground">Description:</p>
            <p className="font-bold">{template.description}</p>

            <p className="text-muted-foreground">Date Created:</p>
            <p>{format(template.createdAt, "MM-dd-yyyy")}</p>
          </div>

          {template.attachment && (
            <div className="flex-center">
              <Image
                height={100}
                width={100}
                className="w-[100px] h-[100px]"
                src={template.attachment}
                alt="Chat Image"
              />
            </div>
          )}
        </div>
        {showSelect ? (
          <Button
            className="mt-auto"
            variant="outlineprimary"
            size="sm"
            onClick={() => emitter.emit("templateSelected", template)}
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
      {/* <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${template.state} - ${template.templateNumber}`}</h3>

        <CardData title="State" value={template.state} />
        <CardData title="type" value={template.type} />
        <CardData title="templateNumber" value={template.templateNumber} />
        <CardData
          title="dateExpires"
          value={format(template.dateExpires, "MM-dd-yyy")}
        />
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
      </div> */}
    </>
  );
};
