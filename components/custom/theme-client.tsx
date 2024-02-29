"use client";
import { useEffect, useState } from "react";
import { CheckIcon, Moon, MoonIcon, Sun, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { useConfig } from "@/hooks/use-config";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Theme, themes } from "@/constants/themes";

export function ThemeClient() {
  const [mounted, setMounted] = useState(false);
  const { setTheme: setMode, resolvedTheme: mode } = useTheme();
  const [config, setConfig] = useConfig();
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
        <div className="space-y-0.5">
          <h3 className="flex items-center gap-2">
            <span className="font-semibold">Theme</span>
          </h3>
          <p className="text-muted-foreground">Set Page Theme</p>
        </div>
        <div>
          {/* <RadioGroup
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
          </RadioGroup> */}
          <div className="grid grid-cols-3 gap-2">
            {mounted ? (
              <>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() => setMode("light")}
                  className={cn(mode === "light" && "border-2 border-primary")}
                >
                  <SunIcon className="mr-1 -translate-x-1" />
                  Light
                </Button>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() => setMode("dark")}
                  className={cn(mode === "dark" && "border-2 border-primary")}
                >
                  <MoonIcon className="mr-1 -translate-x-1" />
                  Dark
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
          </div>
          {/* {themes.map((theme) => {
            const isActive = config.theme === theme.name;

            return mounted ? (
              <Button
                variant={"outline"}
                size="sm"
                key={theme.name}
                onClick={() => {
                  setConfig({
                    ...config,
                    theme: theme.name,
                  });
                }}
                className={cn(
                  "justify-start",
                  isActive && "border-2 border-primary"
                )}
                style={
                  {
                    "--theme-primary": `hsl(${
                      theme?.activeColor[mode === "dark" ? "dark" : "light"]
                    })`,
                  } as React.CSSProperties
                }
              >
                <span
                  className={cn(
                    "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
                  )}
                >
                  {isActive && <CheckIcon className="h-4 w-4 text-white" />}
                </span>
                {theme.label}
              </Button>
            ) : (
              <Skeleton className="h-8 w-full" key={theme.name} />
            );
          })} */}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
        <div className="space-y-0.5">
          <h3 className="flex items-center gap-2">
            <span className="font-semibold">Color</span>
          </h3>
          <p className="text-muted-foreground">Set Page Color</p>
        </div>
        <div className="mr-2 hidden items-center space-x-0.5 lg:flex">
          {mounted ? (
            <>
              {themes.map((theme) => {
                // const theme = themes.find((theme) => theme.name === color);
                const isActive = config.theme === theme.name;

                if (!theme) {
                  return null;
                }

                return (
                  <Tooltip key={theme.name}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() =>
                          setConfig({
                            ...config,
                            theme: theme.name,
                          })
                        }
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs",
                          isActive
                            ? "border-[--theme-primary]"
                            : "border-transparent"
                        )}
                        style={
                          {
                            "--theme-primary": `hsl(${
                              theme?.activeColor[
                                mode === "dark" ? "dark" : "light"
                              ]
                            })`,
                          } as React.CSSProperties
                        }
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full bg-[--theme-primary]"
                          )}
                        >
                          {isActive && (
                            <CheckIcon className="h-4 w-4 text-white" />
                          )}
                        </span>
                        <span className="sr-only">{theme.label}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      align="center"
                      className="rounded-[0.5rem] bg-zinc-900 text-zinc-50"
                    >
                      {theme.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </>
          ) : (
            <div className="mr-1 flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
