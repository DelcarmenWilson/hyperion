"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeadStore } from "@/stores/lead-store";
import { useLeadData } from "@/hooks/lead/use-lead";

import { Lead } from "@prisma/client";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Card, CardContent } from "../ui/card";
import { buttonVariants } from "../ui/button";
import { getAge } from "@/formulas/dates";

const MultipleLeadsDialog = () => {
  const { leadIds, isMultipleLeadDialogOpen, onMultipleLeadDialogClose } =
    useLeadStore();
  const { onGetMultipleLeads } = useLeadData();
  const { leads, leadsFetching } = onGetMultipleLeads();

  return (
    <Dialog
      open={isMultipleLeadDialogOpen}
      onOpenChange={onMultipleLeadDialogClose}
    >
      <DialogContent>
        <CustomDialogHeader icon={User} title={`Leads ${leadIds?.length}`} />
        <SkeletonWrapper isLoading={leadsFetching}>
          {leads?.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SkeletonWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default MultipleLeadsDialog;

const LeadCard = ({ lead }: { lead: Lead }) => {
  return (
    <Card>
      <CardContent className="flex justify-between items-center gap-2 !p-2">
        <p className="flex items-center gap-2">
          <span>
            {lead.firstName} {lead.lastName}
          </span>
          <span>{getAge(lead.dateOfBirth)}</span>
          <span>{lead.state}</span>
        </p>

        <Link
          href={`/leads/${lead.id}`}
          target="_blank"
          className={cn(
            buttonVariants({
              variant: "outlineprimary",
              size: "sm",
            })
          )}
        >
          View Lead
        </Link>
      </CardContent>
    </Card>
  );
};
