"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, MessageCircleDashed, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuoteActions } from "@/hooks/admin/use-quote";

import { CreateQuoteSchema, CreateQuoteSchemaType } from "@/schemas/admin";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CustomDialogHeader from "@/components/custom-dialog-header";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CreateQuoteDialog = ({ triggerText }: { triggerText?: string }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateQuoteSchemaType>({
    resolver: zodResolver(CreateQuoteSchema),
    defaultValues: {},
  });

  const { onCreateQuote, creatingQuote } = useQuoteActions(() => {
    form.reset();
    setOpen(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus size={15} /> {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={MessageCircleDashed}
          title="Create quote"
          subTitle="Add an inspirational quote"
        />
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onCreateQuote)}
            >
              {/* AUTHOR */}
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Author <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="James Brown"
                        disabled={creatingQuote}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormDescription>Who is the author?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* QUOTE */}
              <FormField
                control={form.control}
                name="quote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Quote <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        {...field}
                        placeholder="Just a Saying"
                        disabled={creatingQuote}
                        autoComplete="Quote"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide an inpirational Quote
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={creatingQuote}>
                {creatingQuote && <Loader2 className="animate-spin" />}
                Proceed
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuoteDialog;
