"use client";
import * as z from "zod";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TwilioSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";

export const TwilioForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<z.infer<typeof TwilioSchema>>({
    resolver: zodResolver(TwilioSchema),
    defaultValues: {
      phone: "",
      message: "",
    },
  });

  // const onMessage = async (values: z.infer<typeof TwilioSchema>) => {
  //  try {
  //    const response =await axios.post("/api/sendsms",values)
  //   console.log(response.data)
  //  } catch (error) {
  //   console.log(error)
    
  //  }
  // };
  const onMessage = async (values: z.infer<typeof TwilioSchema>) => {
    try {
      const response =await axios.post("/api/sendsms",values)
      // const response =await axios.post("/api/sendcall",values)
     console.log(response.data)
    } catch (error) {
     console.log(error)     
    }
   };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onMessage)}>
          <div className="space-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Phone #</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="4578957412"
                      disabled={isPending}
                      autoComplete="phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="message goes here"
                      disabled={isPending}
                      autoComplete="message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit">
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
};
