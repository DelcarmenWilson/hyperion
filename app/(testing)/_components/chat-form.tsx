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
import { Textarea } from "@/components/ui/textarea";
import { ChatSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export const ChatForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<z.infer<typeof ChatSchema>>({
    resolver: zodResolver(ChatSchema),
    defaultValues: {
      prompt: "You are very grumpy. Please answer my question with sacarsam and grumpiness.",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ChatSchema>) => {
    try {
      const response = await axios.post("/api/chat-gpt", values);
      // const response =await axios.post("/api/sendcall",values)
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="prompt goes here"
                      disabled={isPending}
                      autoComplete="prompt"
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
                      placeholder="what is the weather like in NY"
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
