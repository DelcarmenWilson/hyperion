"use client";
import React, { ReactNode, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { ExpenseType } from "@/types";
import { LeadExpenseSchema, LeadExpenseSchemaType } from "@/schemas/lead";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  leadExpenseInsert,
  leadExpenseUpdateById,
} from "@/actions/lead/expense";
import { Loader2 } from "lucide-react";
import { LeadExpense } from "@prisma/client";

type CreateExpenseFormProps = {
  leadId: string;
  expense?: LeadExpense;
  type: ExpenseType;
  trigger: ReactNode;
};

const CreateExpenseForm = ({
  leadId,
  expense,
  trigger,
  type,
}: CreateExpenseFormProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const btnText = expense ? "Update" : "Create";
  const form = useForm<LeadExpenseSchemaType>({
    resolver: zodResolver(LeadExpenseSchema),
    //@ts-ignore
    defaultValues: expense || {
      leadId,
      type,
      name: "",
      value: 0,
      notes: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: expense ? leadExpenseUpdateById : leadExpenseInsert,
    onSuccess: () => {
      const toastString = expense
        ? "Transaction updated successfully"
        : "Transaction created successfully";

      toast.success(toastString, {
        id: "insert-update-transaction",
      });

      form.reset({
        type,
        name: "",
        value: 0,
        notes: "",
      });

      // After creating an expense or income transaction, we need to invalidate the overview query which will refetch data in the expense page
      queryClient.invalidateQueries({
        queryKey: ["leadExpense"],
      });

      setOpen((prev) => !prev);
    },
  });

  const onSubmit = useCallback(
    (values: LeadExpenseSchemaType) => {
      const toastString = expense
        ? "Updating transaction..."
        : "Creating transaction...";
      toast.loading(toastString, { id: "insert-update-transaction" });

      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogDescription className="hidden">Expense Form</DialogDescription>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={cn(
                "m-1",
                type === "Income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>{type} Name</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>{type} amount</FormDescription>
                </FormItem>
              )}
            />

            {/* NOTES   */}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>Notes for you reference</FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending ? btnText : <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExpenseForm;
