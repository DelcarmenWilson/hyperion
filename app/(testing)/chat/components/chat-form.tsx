"use client";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { chatFetch } from "@/actions/chat";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ChatSchema } from "@/schemas";
import axios from "axios";

interface ChatFormProps {
  onClose: () => void;
}
export const ChatForm = ({ onClose }: ChatFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof ChatSchema>>({
    resolver: zodResolver(ChatSchema),
    defaultValues: {
      prompt:
        "You are very grumpy. Please answer my question with sacarsam and grumpiness.",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ChatSchema>) => {
    try {
      setLoading(true)
      // const messages = [
      //   { role: "system", content: values.prompt },
      //   { role: "user", content: values.message },
      // ];
      // const response = await chatFetch(messages);
       const response = await axios.post("/api/chat-gpt", values);
      // const response =await axios.post("/api/sendcall",values)
      console.log(response);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
      //onClose();
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
                      disabled={loading}
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
                      disabled={loading}
                      autoComplete="message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button disabled={loading} type="submit">
              Send
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
