"use client";
import { Plus } from "lucide-react";

import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageColumn, columns } from "./columns";
import { DataTable } from "@/components/custom/data-table";
import { ApiList } from "@/components/custom/api-list";
import { Modal } from "@/components/custom/modal";
import { useState } from "react";
import { ChatForm } from "./chat-form";
import { useRouter } from "next/navigation";

interface ChatClientProps {
  data: MessageColumn[]|[];
}
export const ChatClient = ({ data }: ChatClientProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Send new Message"
        description=""
      >
        <ChatForm
          onClose={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </Modal>
      <div className="flex items-center justify-between">
        <Heading
          title={`Messages (${data.length})`}
          description="Manage messages for each client"
        />
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="role" columns={columns} data={data} />
      <Heading title="API" description="API calls for Teams" />
      <Separator />
      <ApiList entityName="teams" entityIdName="teamId" />
    </>
  );
};
