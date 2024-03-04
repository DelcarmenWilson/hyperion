import * as z from "zod";
import { useState } from "react";
import { PictureInPicture, Send } from "lucide-react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SmsMessageSchema } from "@/schemas";
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
import { Message } from "@prisma/client";

type SmsFormProps = {
  leadId: string;
  onNewMessage: (e: Message) => void;
};

type SmsFormValues = z.infer<typeof SmsMessageSchema>;

export const SmsForm = ({ leadId, onNewMessage }: SmsFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<SmsFormValues>({
    resolver: zodResolver(SmsMessageSchema),
    defaultValues: {
      leadId,
      content: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    // if (onClose) {
    //   onClose();
    // }
  };

  const onSubmit = async (values: SmsFormValues) => {
    if (!leadId) {
      toast.error("Lead id is not supplied");
    }
    setLoading(true);
    await smsCreate(values).then((data) => {
      if (data.success) {
        onNewMessage(data.success);
      }
      if (data.error) {
        toast.error(data.error);
      }
      form.reset();
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
          <div className="flex items-center p-2 w-full gap-2">
            {/* <PictureInPicture size={16} /> */}
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
              disabled={loading}
              type="submit"
            >
              <Send size={16} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
