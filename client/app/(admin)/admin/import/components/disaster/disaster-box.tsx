"use client";

import { useState, useTransition } from "react";
import Papa from "papaparse";
import { toast } from "sonner";

import { DataTableImport } from "@/components/tables/data-table-import";
import { columns, DisasterType } from "./columns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { convertDisaster } from "@/formulas/inital-data";
import { initialDisasterMessages } from "@/actions/initial-data";

export const DisasterClient = () => {
  const [messages, setMessages] = useState<DisasterType[]>([]);
  const [isPending, startTransition] = useTransition();

  const onFileUploaded = (e: any) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result: any) {
        const mapped: DisasterType[] = convertDisaster(result);
        setMessages(mapped);
      },
    });
  };

  const onImport = () => {
    startTransition(() => {
      initialDisasterMessages(messages).then((data) => {
        if (data?.success) {
          onCancel();
          toast.success(data.success);
        }
        // else toast.success(data.error);
      });
    });
  };

  const onCancel = () => {
    setMessages([]);
  };
  return (
    <div className="h-[500px] flex flex-col gap-2 p-3 bg-background">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold py-2">Import Messages</h3>
        <div className="flex justify-end items-center w-full">
          {messages.length > 0 && (
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
          data={messages}
          size="lg"
          noresults="Select a file"
          setFile={onFileUploaded}
        />
      </ScrollArea>
    </div>
  );
};
