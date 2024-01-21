import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";

interface BoxProps {
  icon: LucideIcon;
  title: string;
  description: string;
  subdescription?: string;
  children: React.ReactNode;
}
export const Box = ({
  icon: Icon,
  title,
  description,
  subdescription,
  children,
}: BoxProps) => {
  return (
    <Card className="relative  overflow-hidden w-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-accent p-4 rounded-br-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className=" text-xl text-muted-foreground text-right">
          <span>{title}</span>
        </CardTitle>
      </div>

      <CardContent className="flex flex-col p-2">
        <CardDescription className="">
          <span className="text-md block">{description}</span>
          <span className="text-xs font-medium">{subdescription}</span>
        </CardDescription>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger asChild>
              <Button
                className="w-full justify-center mt-4"
                variant="outlineprimary"
              >
                SHOW MORE
              </Button>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col pt-2 gap-2">
              {children}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
