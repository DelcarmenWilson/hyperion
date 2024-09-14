"use client";
import { Check, X } from "lucide-react";
import { useLeadEmailData } from "@/hooks/lead/use-email";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatDateTime } from "@/formulas/dates";

export const EmailClient = () => {
  const { emails, isFetchingEmails } = useLeadEmailData();

  return (
    <div className="text-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Body</TableHead>
            <TableHead>Recieved</TableHead>
            <TableHead>Opened</TableHead>
            <TableHead>Date / Time</TableHead>
          </TableRow>
        </TableHeader>
        <SkeletonWrapper isLoading={isFetchingEmails} fullWidth>
          <TableBody>
            {emails?.map((email) => (
              <TableRow key={email.id}>
                <TableCell> {email.type}</TableCell>
                <TableCell> {email.subject}</TableCell>
                <TableCell> {email.body}</TableCell>
                <TableCell>
                  {email.recieved ? <Check size={15} /> : <X size={15} />}
                </TableCell>
                <TableCell>
                  {email.opened ? <Check size={15} /> : <X size={15} />}
                </TableCell>
                <TableCell> {formatDateTime(email.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </SkeletonWrapper>
      </Table>
      {!emails?.length && (
        <p className="text-muted-foreground text-center mt-2">No calls found</p>
      )}
    </div>
  );
};
