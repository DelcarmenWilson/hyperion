import * as z from "zod";
import { useEffect, useState } from "react";
import { Send } from "lucide-react";

import { userEmitter } from "@/lib/event-emmiter";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SmsMessageSchema, SmsMessageSchemaType } from "@/schemas/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { smsCreate } from "@/actions/sms";

export const GptConversationForm = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<SmsMessageSchemaType>({
    resolver: zodResolver(SmsMessageSchema),
    defaultValues: {
      conversationId,
      content: "",
      type: "sms",
    },
  });
  const disabled: boolean = !form.getValues("content");

  const onCancel = () => {
    form.clearErrors();
    form.reset();
  };

  const onSubmit = async (values: SmsMessageSchemaType) => {
    setLoading(true);
    const response = await smsCreate(values);
    if (response.success) userEmitter.emit("messageInserted", response.success);
    else toast.error(response.error);
    onCancel();

    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        className="space-6 px-2 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex items-center p-2 w-full">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="message"
                    disabled={loading}
                    autoComplete="Message"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="rounded-md"
            size="icon"
            disabled={loading || disabled}
            type="submit"
          >
            <Send size={16} />
          </Button>
        </div>
      </form>
    </Form>
  );
};
