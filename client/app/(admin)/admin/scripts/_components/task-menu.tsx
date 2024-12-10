"use client";
import { useScriptStore } from "@/stores/script-store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { DefaultKeyWords } from "@/constants/texts";

const TaskMenu = () => {
  return (
    <aside className="w-[250px] min-w-[250px] max-w-[250px] border-r-2 border h-full p-2 px-4 overflow-hidden bg-background">
      <ScrollArea>
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["lead", "agent", "general"]}
        >
          <AccordionItem value="lead">
            <AccordionTrigger className="font-bold">
              Lead Variables
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              {DefaultKeyWords.filter((e) => e.type == "lead").map(
                (keyword) => (
                  <TaskMenuBtn
                    key={keyword.value}
                    name={keyword.name}
                    value={keyword.value}
                  />
                )
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="agent">
            <AccordionTrigger className="font-bold">
              Agent Variables
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              {DefaultKeyWords.filter((e) => e.type == "agent").map(
                (keyword) => (
                  <TaskMenuBtn
                    key={keyword.value}
                    name={keyword.name}
                    value={keyword.value}
                  />
                )
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="general">
            <AccordionTrigger className="font-bold">
              General Variables
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              {DefaultKeyWords.filter((e) => e.type == "general").map(
                (keyword) => (
                  <TaskMenuBtn
                    key={keyword.value}
                    name={keyword.name}
                    value={keyword.value}
                  />
                )
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </aside>
  );
};

const TaskMenuBtn = ({ name, value }: { name: string; value: string }) => {
  const { setNewContent } = useScriptStore();
  return (
    <Button
      variant="gradientDark"
      className="border w-full capitalize"
      onClick={() => setNewContent(value)}
    >
      {name}
    </Button>
  );
};

export default TaskMenu;
