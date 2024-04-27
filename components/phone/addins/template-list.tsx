"use client";
import React from "react";
import Image from "next/image";
import { useGlobalContext } from "@/providers/global";
import { UserTemplate } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

type TemplateListProps = {
  OnSetAttachment: (e: UserTemplate) => void;
};

export const TemplateList = ({ OnSetAttachment }: TemplateListProps) => {
  const { templates } = useGlobalContext();
  return (
    <ScrollArea>
      <div className="flex-1 grid grid-cols-2 gap-2 h-full">
        {templates?.map((tp) => (
          <div
            className="flex flex-col gap-2 border hover:bg-secondary text-sm p-2"
            key={tp.id}
          >
            <h2 className="text-primary text-2xl text-center">{tp.name}</h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-2 col-span-2">
                <p className="text-muted-foreground">Message:</p>
                <p className="font-bold">{tp.message}</p>
                <p className="text-muted-foreground">Description:</p>
                <p className="font-bold">{tp.description}</p>

                <p className="text-muted-foreground">Date Created:</p>
                <p>{format(tp.createdAt, "MM-dd-yyyy")}</p>
              </div>

              <div className="flex-center">
                {tp.attachment && (
                  <Image
                    height={200}
                    width={200}
                    className="w-full h-full"
                    src={tp.attachment}
                    alt="Chat Image"
                  />
                )}
              </div>
            </div>

            <Button
              className="mt-auto"
              variant="outlineprimary"
              size="sm"
              onClick={() => OnSetAttachment(tp)}
            >
              Select
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
