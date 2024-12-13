"use client";
import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTodoCategoryData } from "@/hooks/user/use-todo-category";
import { HyperionColors } from "@/lib/colors";

import { UserTodoCategory } from "@prisma/client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import SkeletonWrapper from "@/components/skeleton-wrapper";

interface Props {
  defaultValue: string | undefined;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: () => void;
}

const LeadPicker = ({ defaultValue, onChange, open, setOpen }: Props) => {
  const [value, setValue] = useState(defaultValue || "");
  const { onGetCategories } = useTodoCategoryData();
  const { categories, categoriesFetching, categoriesLoading } =
    onGetCategories();

  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [onChange, value]);

  const selectedCategory = categories?.find(
    (category: UserTodoCategory) => category.id === value
  );

  const successCallback = useCallback(
    (category: UserTodoCategory) => {
      setValue(category.id);
      //   setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );
  return (
    <Command
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <CommandEmpty>
        <p>Category not found</p>
        <p className="text-xs text-muted-foreground">
          Tip: Create a new category
        </p>
      </CommandEmpty>
      <CommandGroup>
        <CommandList>
          <SkeletonWrapper isLoading={categoriesFetching}>
            {categories?.map((category) => (
              <CommandItem
                key={category.name}
                onSelect={() => {
                  setValue(category.id);
                  //   setOpen((prev) => !prev);
                }}
              >
                <CategoryRow category={category} />
                <Check
                  className={cn(
                    "mr-2 w-4 h-4 opacity-0",
                    value === category.name && "opacity-100"
                  )}
                />
              </CommandItem>
            ))}
          </SkeletonWrapper>
        </CommandList>
      </CommandGroup>
    </Command>
  );
};

const labelCirlceColors = {
  [HyperionColors.INDIGO]: "bg-indigo-500",
  [HyperionColors.GRAY]: "bg-gray-500",
  [HyperionColors.GREEN]: "bg-green-500",
  [HyperionColors.BLUE]: "bg-blue-500",
  [HyperionColors.RED]: "bg-red-500",
  [HyperionColors.PURPLE]: "bg-purple-500",
  [HyperionColors.PRIMARY]: "bg-primary text-background",
};

const CategoryRow = ({ category }: { category: UserTodoCategory }) => {
  return (
    <div className="flex items-center gap-2 group">
      <span
        className={cn(
          "flex-center w-6 h-6 rounded-full ",
          labelCirlceColors[category.color as HyperionColors]
        )}
      ></span>

      <span>{category.name}</span>
    </div>
  );
};

export default LeadPicker;
