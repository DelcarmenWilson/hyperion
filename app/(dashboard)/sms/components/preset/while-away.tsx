"use client";
import { Box } from "@/components/reusable/box";
import { Umbrella } from "lucide-react";

export const WhileAway = () => {
  return (
    <Box
      icon={Umbrella}
      title="Initial Preset Text While Away"
      description="Goind on vacation?. Set your status as away to use this text message in place of the usual initial text message until you get back."
      subdescription="* Drip marketing will be disabled while you are away."
    >
      dimelo
    </Box>
  );
};
