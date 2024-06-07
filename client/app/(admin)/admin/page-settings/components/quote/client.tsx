"use client";
import { toast } from "sonner";
import React, { useState } from "react";
import { Plus, Shuffle } from "lucide-react";

import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { Heading } from "@/components/custom/heading";
import { Quote } from "@prisma/client";
import { Button } from "@/components/ui/button";

import { QuoteForm } from "./form";
import { columns } from "./columns";
import { adminQuoteUpdateActive } from "@/actions/admin/quote";

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
  const onSetRandomQuote = () => {
    adminQuoteUpdateActive().then((data) => {
      if (data.success) {
        toast.success("New quote has been selected!");
      }
    });
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

      <Heading title="Quotes" description="Manage all quotes" />

      <DataTable
        columns={columns}
        data={quotes}
        topMenu={
          <div className="flex col-span-3 gap-2 justify-end">
            <Button variant="outline" onClick={onSetRandomQuote}>
              <Shuffle size={16} className="mr-2" /> Set Random Quote
            </Button>
            <Button onClick={() => setIsDrawerOpen(true)}>
              <Plus size={16} className="mr-2" /> New Quote
            </Button>
          </div>
        }
      />
    </>
  );
};
