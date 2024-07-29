import React from "react";
import { Button } from "@/components/ui/button";
import { PhoneNumber } from "@prisma/client";
import { usePhoneSetup } from "@/hooks/use-phone-setup";

export const UnassignedActions = ({
  phoneNumber,
}: {
  phoneNumber: PhoneNumber;
}) => {
  const { onUnassignedFormOpen } = usePhoneSetup();
  return (
    <Button size="sm" onClick={() => onUnassignedFormOpen(phoneNumber)}>
      Details
    </Button>
  );
};
