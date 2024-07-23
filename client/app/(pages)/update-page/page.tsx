import React from "react";
import { Sparkle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageLayout } from "@/components/custom/layout/page-layout";
import { PageUpdateList } from "./components/list";
import { pageUpdatesGetAll } from "@/actions/admin/page-update";
import { formatDate } from "@/formulas/dates";

const UpdatePage = async () => {
  const updates = await pageUpdatesGetAll();
  const dates: string[] = [];

  updates.forEach((update) => {
    const dt = formatDate(update.updatedAt);
    if (dates.includes(dt)) return;
    dates.push(dt);
  });

  if (!dates) return null;

  return (
    <PageLayout title="Page Updates" icon={Sparkle}>
      <Accordion type="multiple" className="w-full" defaultValue={[...dates]}>
        {dates.map((date) => (
          <PageUpdateList
            key={date.toString()}
            date={date}
            updates={updates.filter((up) => formatDate(up.updatedAt) == date)}
          />
        ))}
      </Accordion>
    </PageLayout>
  );
};

export default UpdatePage;
