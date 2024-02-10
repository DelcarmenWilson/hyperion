import { Button } from "@/components/ui/button";
import { Clock, MoreVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { LeadBox } from "./lead-box";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FullLead } from "@/types";

interface BoxProps {
  title: string;
  leads: FullLead[];
}
export const Box = ({ title, leads }: BoxProps) => {
  return (
    <section className="flex flex-col gap-2 border border-primary h-[400px]">
      <div className="bg-primary text-background flex justify-between items-center gap-2 px-2">
        <p>{title}</p>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <Select>
          <SelectTrigger>
            <Clock className="w-4 h-4" />
            <SelectValue placeholder="Filter Timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="East">Esat</SelectItem>
            <SelectItem value={"West"}>West</SelectItem>
            <SelectItem value="North">North</SelectItem>
            <SelectItem value={"South"}>South</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-between items-center gap-2 px-2">
        <Button>START DIALING</Button>
        <p>Total leads: {leads.length}</p>
      </div>
      <Separator className="my-2" />
      <ScrollArea>
        {leads.map((lead) => (
          <LeadBox key={lead.id} lead={lead} />
        ))}
      </ScrollArea>
    </section>
  );
};
