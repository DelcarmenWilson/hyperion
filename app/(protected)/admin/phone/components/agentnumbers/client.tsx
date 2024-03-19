"use client";
import { ClipboardList } from "lucide-react";
import { CardLayout } from "@/components/custom/card/layout";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { FullPhoneNumber } from "@/types";

type AgentNumbersClientProps = {
  phoneNumbers: FullPhoneNumber[];
};
export const AgentNumbersClient = ({
  phoneNumbers,
}: AgentNumbersClientProps) => {
  return (
    <CardLayout title="Agent Numbers" icon={ClipboardList}>
      <DataTable data={phoneNumbers} columns={columns} headers />
    </CardLayout>
  );
};
