import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { QuoteSchema, QuoteSchemaType } from "@/schemas/admin";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { adminQuoteInsert } from "@/actions/admin/quote";
import { Quote } from "@prisma/client";

export const QuoteForm = ({ onClose }: { onClose?: (e?: Quote) => void }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<QuoteSchemaType>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      quote: "",
      author: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: QuoteSchemaType) => {
    setLoading(true);
    const insertedQuote = await adminQuoteInsert(values);
    if (insertedQuote.success) {
      form.reset();
      if (onClose) onClose(insertedQuote.success);
      toast.success("Quote created!");
    } else toast.error(insertedQuote.error);
    setLoading(false);
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            {/* NAME */}
            <FormField
              control={form.control}
              name="quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Quote
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Just a Saying"
                      disabled={loading}
                      autoComplete="Quote"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* DESCRIPTION*/}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Author
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="James Brown"
                      disabled={loading}
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
