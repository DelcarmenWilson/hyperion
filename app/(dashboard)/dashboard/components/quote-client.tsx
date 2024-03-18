import { Button } from "@/components/ui/button";
import { Quote } from "@prisma/client";

type QuoteClientProps = {
  quote: Quote;
};
export const QuoteClient = ({ quote }: QuoteClientProps) => {
  if (!quote) return null;
  return (
    <div className="flex flex-col relative p-4 rounded-xl border bg-card text-card-foreground shadow w-full">
      {/* <Button className="absolute top-2 right-2" size="icon">
        <X size={16} />
      </Button> */}
      <p className="font-medium italic text-5xl p-20">
        &quot;{quote.quote}&quot;
      </p>
      <div className="text-end font-bold text-3xl text-primary italic pr-3">
        - {quote.author}
      </div>
    </div>
  );
};
