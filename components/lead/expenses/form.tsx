import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";

import { LeadExpenseSchema } from "@/schemas";
import { leadExpenseInsert } from "@/actions/lead";
import { LeadExpense } from "@prisma/client";

type ExpenseFormProps = {
  leadId: string;
  type: string;
  onExpenseInserted: (e: LeadExpense) => void;
  onClose?: () => void;
};

type ExpenseFormValues = z.infer<typeof LeadExpenseSchema>;

export const ExpenseForm = ({
  leadId,
  type,
  onExpenseInserted,
  onClose,
}: ExpenseFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(LeadExpenseSchema),
    defaultValues: {
      leadId: leadId,
      type: type,
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: ExpenseFormValues) => {
    setLoading(true);

    leadExpenseInsert(values).then((data) => {
      if (data.success) {
        const newExpense = data.success;
        router.refresh();
        toast.success(`${type} Added!`);
        onExpenseInserted(newExpense);
      }
      if (data.error) {
        form.reset();
        toast.error(data.error);
      }
    });

    setLoading(false);
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex flex-col gap-2">
              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={type == "Expense" ? "Rent" : "Business"}
                        disabled={loading}
                        autoComplete="off"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* VALUE */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Value</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="1200"
                        disabled={loading}
                        autoComplete="Value"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* NOTES */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="notes"
                        disabled={loading}
                        autoComplete="Notes"
                        rows={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              Add New {type}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
