"use client";
import { ClipboardList } from "lucide-react";

import { DataTableHeadless } from "@/components/tables/data-table-headless";

import { CardLayout } from "@/components/custom/card-layout";
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
      <DataTableHeadless
        data={phoneNumbers}
        columns={columns}
        searchKey="firstName"
        headers
      />
    </CardLayout>
  );
};
