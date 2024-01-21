"use client";
import { Box } from "@/components/reusable/box";
import { CircleDollarSign } from "lucide-react";

export const Reminder = () => {
  return (
    <Box
      icon={CircleDollarSign}
      title="Verification Reminder Preset Text"
      description="Send your lead a text reminiding them of you verification after a sale."
    >
      dimelo
    </Box>
  );
};
