"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useCurrentRole } from "@/hooks/user-current-role";

import { LeadStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/custom/data-table";
import { columns } from "./leadstatus-columns";

import { leadStatusInsert } from "@/actions/lead";

import { adminLeadStatusInsert } from "@/actions/admin";
import { usePhoneContext } from "@/providers/phone-provider";

type LeadStatusBoxProps = {
  leadStatus: LeadStatus[];
};
export const LeadStatusBox = ({ leadStatus }: LeadStatusBoxProps) => {
  const role = useCurrentRole();
  const { setLeadStatus } = usePhoneContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const onSubmit = () => {
    if (!newStatus) {
      toast.error("Status cannot be empty!");
    }
    setLoading(true);
    if (role == "MASTER") {
      onAdminInsert();
    } else {
      onUserInsert();
    }
    setLoading(false);
  };
  const onAdminInsert = () => {
    adminLeadStatusInsert(newStatus).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        setNewStatus("");
        router.refresh();
      }
    });
  };
  const onUserInsert = () => {
    leadStatusInsert(newStatus).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success("Lead status created");
        setLeadStatus((current) => {
          if (!current) {
            return current;
          }
          return [...current, data.success];
        });
        setNewStatus("");
        router.refresh();
      }
    });
  };
  return (
    <div>
      <Heading title={`Lead Status`} description="Manage default lead status" />
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-2">
          <p>Status Name</p>
          <Input
            disabled={loading}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />

          <Button disabled={loading} onClick={onSubmit}>
            Submit
          </Button>
        </div>
        <div className="col-span-2">
          <DataTable columns={columns} data={leadStatus} searchKey="status" />
        </div>
      </div>
    </div>
  );
};
