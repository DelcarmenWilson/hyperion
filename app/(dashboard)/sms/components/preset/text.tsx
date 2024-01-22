"use client";
import { Box } from "@/components/reusable/box";
import { Pencil, Trash, Zap } from "lucide-react";
import { PresetForm } from "./preset-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PresetData } from "./preset-data";
import { Presets } from "@prisma/client";

interface TextProps {
  presets: Presets[];
}
export const Text = ({ presets }: TextProps) => {
  return (
    <Box
      icon={Zap}
      title="Initial Preset Texts"
      description="Send new leads a text when they come into the systme. If ypou chose multiple template we'll choose a different one eacj time a new lead comes in."
      subdescription="* Delete all templates if you do not wish to use this feature"
    >
      <PresetForm type="Text" />

      <h3>Current intial Preset texts</h3>
      <Separator className="my-2" />
      {presets.map((preset) => (
        <PresetData key={preset.id} preset={preset} />
      ))}
    </Box>
  );
};
