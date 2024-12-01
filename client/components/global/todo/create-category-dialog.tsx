"use client";
import React, { useState } from "react";
import { Loader2, PlusSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTodoCategoryActions } from "@/hooks/user/use-todo-category";

import { cn } from "@/lib/utils";

import { UserTodoCategory } from "@prisma/client";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schemas/category";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEnumValues } from "@/lib/helper/enum-converter";
import { HyperionColors } from "@/lib/colors";

const labelCirlceColors = {
  [HyperionColors.INDIGO]: "bg-indigo-500",
  [HyperionColors.GRAY]: "bg-gray-500",
  [HyperionColors.GREEN]: "bg-green-500",
  [HyperionColors.BLUE]: "bg-blue-500",
  [HyperionColors.RED]: "bg-red-500",
  [HyperionColors.PURPLE]: "bg-purple-500",
  [HyperionColors.PRIMARY]: "bg-primary text-background",
};

interface Props {
  successCallback: (category: UserTodoCategory) => void;
}

const CreateCategoryDialog = ({ successCallback }: Props) => {
  const [open, setOpen] = useState(false);

  const colors = getEnumValues(HyperionColors);

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      color: HyperionColors.PRIMARY,
    },
  });
  const onCreateCategoryCallBack = (category: UserTodoCategory) => {
    // form.reset({ name: "", icon: "", type });
    successCallback(category);
    setOpen((prev) => !prev);
  };
  const { onCreateCategory, categoryCreating } = useTodoCategoryActions(
    onCreateCategoryCallBack
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex border-separate itemc justify-start rounded-none border-b p-3 text-muted-foreground "
        >
          <PlusSquare className="mr-2 h-4 w-4" /> Create new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>
            Categories are used to group your todos
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onCreateCategory)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* COLOR */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    name="ddlColor"
                    disabled={categoryCreating}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex gap-2">
                            <span
                              className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-cente",
                                labelCirlceColors[color.value as HyperionColors]
                              )}
                            ></span>
                            <span className="lowercase">{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Label color for your category
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={form.handleSubmit(onCreateCategory)}
            disabled={categoryCreating}
          >
            {categoryCreating ? <Loader2 className="animate-spin" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
