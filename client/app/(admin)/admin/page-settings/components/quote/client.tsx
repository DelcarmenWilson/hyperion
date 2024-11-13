import { MessageCircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

import { Quote } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/custom/heading";

import { formatDate } from "@/formulas/dates";
import CreateQuoteDialog from "./create-quote-dialog";
import AlertError from "@/components/custom/alert-error";
import NewEmptyCard from "@/components/reusable/new-empty-card";
import { getQuotes } from "@/actions/admin/quote/get-quotes";
import SetActiveQuoteBtn from "./set-active-quote-btn";

const QuoteClient = async () => {
  const quotes = await getQuotes();
  if (!quotes) return <AlertError />;
  if (quotes.length === 0)
    return <NewEmptyCard title="No quote found" icon={MessageCircleDashed} />;
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title="Quotes" description="Manage all quotes" />
        <div className="flex gap-2">
          <SetActiveQuoteBtn />
          <CreateQuoteDialog triggerText="Create Quote" />
        </div>
      </div>

      <div className=" grid grid-cols-2 gap-2">
        {quotes.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>
    </>
  );
};

const QuoteCard = ({ quote }: { quote: Quote }) => {
  const { quote: qt, author, active, createdAt } = quote;
  return (
    <Card
      className={cn(
        "border border-separate shadow-sm rounded-lg overflow-hidden hover:bg-primary/30 hover:shadow-sm dark:shadow-primary/30",
        active && "bg-primary/30"
      )}
    >
      <CardContent className="relative p-4 flex items-center justify-between h-[100px]">
        <div className="absolute top-1 right-2 flex gap-1 items-center text-muted-foreground text-sm">
          <span className="italic">{formatDate(createdAt)}</span>
        </div>
        <div className="flex items-center justify-end space-x-3 overflow-ellipsis">
          <div>
            <h3 className="flex text-base font-bold text-muted-foreground items-center">
              {author}
            </h3>

            <p className="text-xs text-muted-foreground w-[80%] text-ellipsis line-clamp-2">
              {qt}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteClient;
