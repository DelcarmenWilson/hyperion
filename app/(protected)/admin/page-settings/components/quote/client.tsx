"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";

import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/custom/data-table";
import { Heading } from "@/components/custom/heading";
import { Quote } from "@prisma/client";
import { Button } from "@/components/ui/button";

import { QuoteForm } from "./form";
import { columns } from "./columns";

type QuoteClientProps = {
  initQuotes: Quote[];
};

export const QuoteClient = ({ initQuotes }: QuoteClientProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quotes, setQuote] = useState(initQuotes);
  const onQuoteCreated = (e?: Quote) => {
    if (e) {
      setQuote((quote) => {
        return [...quote, e];
      });
    }
    setIsDrawerOpen(false);
  };
  return (
    <>
      <DrawerRight
        title={"New Quote"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <QuoteForm onClose={onQuoteCreated} />
      </DrawerRight>
      <div className="flex justify-between items-end">
        <Heading title="Quote" description="Manage all quotes" />
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus size={16} className="mr-2" /> New Quote
        </Button>
      </div>

      <DataTable columns={columns} data={quotes} searchKey="name" />
    </>
  );
};
