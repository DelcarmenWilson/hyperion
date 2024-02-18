"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { capitalize } from "lodash";

export function ThemeToggleHp() {
  const { setTheme, theme, themes } = useTheme();
  return (
    <>
      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
        <div className="space-y-0.5">
          <h3 className="flex items-center gap-2">
            <span className="font-semibold">Theme</span>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </h3>
          <p className="text-muted-foreground">Set Page Theme</p>
        </div>
        <div>
          <RadioGroup
            defaultValue={theme}
            className="flex gap-3"
            onValueChange={setTheme}
          >
            {themes.map((theme) => (
              <div
                key={theme}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <RadioGroupItem value={theme} id={theme} />
                <Label className="cursor-pointer" htmlFor={theme}>
                  {capitalize(theme)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </>
  );
}
