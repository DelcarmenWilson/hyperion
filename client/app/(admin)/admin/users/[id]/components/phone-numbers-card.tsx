import React from "react";
import { Phone } from "lucide-react";
import { PhoneNumber } from "@prisma/client";

import { CardLayout } from "@/components/custom/card/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatPhoneNumber } from "@/formulas/phones";
import { formatDate } from "@/formulas/dates";

const PhoneNumbersCard = ({
  phoneNumbers,
}: {
  phoneNumbers: PhoneNumber[];
}) => {
  return (
    <CardLayout title="Phone Numbers" icon={Phone}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Phone #</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Renewal Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {phoneNumbers.length == 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <p className="flex-center p-4 text-muted-foreground text-sm">
                  No phone Numbers found
                </p>
              </TableCell>
            </TableRow>
          )}
          {phoneNumbers.map((phoneNumber) => (
            <PhoneNumberCard key={phoneNumber.id} phoneNumber={phoneNumber} />
          ))}
        </TableBody>
      </Table>
    </CardLayout>
  );
};

export default PhoneNumbersCard;

const PhoneNumberCard = ({ phoneNumber }: { phoneNumber: PhoneNumber }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {formatPhoneNumber(phoneNumber.phone)}
      </TableCell>
      <TableCell>{phoneNumber.state}</TableCell>
      <TableCell>{phoneNumber.status}</TableCell>
      <TableCell>{formatDate(phoneNumber.renewAt)}</TableCell>
    </TableRow>
  );
};
