"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { Zap } from "lucide-react";
import { Presets } from "@prisma/client";

import { Box } from "@/components/reusable/box";
import { PresetForm } from "./preset-form";
import { PresetData } from "./preset-data";

interface TextProps {
  initPresets: Presets[];
}
export const Text = ({ initPresets }: TextProps) => {
  const [presets, setPresets] = useState(initPresets);
  const onSetPreset = (preset: Presets) => {
    setPresets((state) => {
      return [...state, preset];
    });
  };
  useEffect(() => {
    userEmitter.on("presetInserted", onSetPreset);
  }, []);
  return (
    <Box
      icon={Zap}
      title="Initial Preset Texts"
      description="Send new leads a text when they come into the system. If you chose multiple templates we'll choose a different one each time a new lead comes in."
      subdescription="* Delete all templates if you do not wish to use this feature"
    >
      <PresetForm type="Text" />

      <h3 className="border-b">Current intial Preset texts</h3>
      {presets.map((preset) => (
        <PresetData key={preset.id} preset={preset} />
      ))}
    </Box>
  );
};
