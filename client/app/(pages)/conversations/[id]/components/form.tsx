"use client";
import { Send } from "lucide-react";
import { useConversationId } from "@/hooks/use-conversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { MessageInput } from "./message-input";

type Props = {
  disabled: boolean;
  phone: string;
  defaultPhone: string;
};
export const Form = ({ disabled, phone, defaultPhone }: Props) => {
  const { conversationId } = useConversationId();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { message: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios
      .post("/api/twilio/sms/out", {
        ...data,
        conversationId,
        phone,
        from: defaultPhone,
      })
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div className="border-t flex items-center pt-2 gap-2 lg:gap-4 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          disabled={disabled}
          id="message"
          type="text"
          register={register}
          required
          errors={errors}
          placeholder="Write a message..."
        />
        <Button
          disabled={disabled}
          size="icon"
          type="submit"
          className="rounded-full"
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
};
