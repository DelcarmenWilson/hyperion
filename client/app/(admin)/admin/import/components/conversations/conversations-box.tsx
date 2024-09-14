"use client";

import { useState, useTransition } from "react";
import Papa from "papaparse";
import { toast } from "sonner";

import { LeadConversation } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTableImport } from "@/components/tables/data-table-import";
import { ScrollArea } from "@/components/ui/scroll-area";

import { convertConversations } from "@/formulas/inital-data";
import { initialConversations } from "@/actions/initial-data";

export const ConversationsBox = () => {
  const [conversations, setConversations] = useState<LeadConversation[]>([]);
  const [isPending, startTransition] = useTransition();

  const onFileUploaded = (e: any) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result: any) {
        const mapped: LeadConversation[] = convertConversations(result);
        setConversations(mapped);
      },
    });
  };

  const onImport = () => {
    startTransition(() => {
      initialConversations(conversations).then((data) => {
        if (data?.success) {
          onCancel();
          toast.success(data.success);
        }
      });
    });
  };

  const onCancel = () => {
    setConversations([]);
  };
  return (
    <div className="h-[500px] flex flex-col gap-2 p-3 bg-background">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold py-2">Import Conversations</h3>
        <div className="flex justify-end items-center w-full">
          {conversations.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" disabled={isPending} onClick={onCancel}>
                Cancel
              </Button>
              <Button disabled={isPending} onClick={onImport}>
                Import
              </Button>
            </div>
          )}
        </div>
      </div>
      <ScrollArea>
        <DataTableImport
          columns={columns}
          data={conversations}
          size="lg"
          noresults="Select a file"
          setFile={onFileUploaded}
        />
      </ScrollArea>
    </div>
  );
};
