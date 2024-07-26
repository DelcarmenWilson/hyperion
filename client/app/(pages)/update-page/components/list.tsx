import React from "react";
import { PageUpdate } from "@prisma/client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageUpdateCard } from "./card";
import { formatDate } from "@/formulas/dates";

export const PageUpdateList = ({
  date,
  updates,
}: {
  date: string;
  updates: PageUpdate[];
}) => {
  return (
    <AccordionItem value={date}>
      <AccordionTrigger className="py-1  [&[data-state=open]>h4]:bg-primary">
        <h4 className="w-[200px] bg-primary/50 hover:bg-primary text-white text-center text-lg font-bold">
          {date}
        </h4>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col  p-1 gap-2">
          {updates.map((update) => (
            <PageUpdateCard key={update.id} update={update} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
