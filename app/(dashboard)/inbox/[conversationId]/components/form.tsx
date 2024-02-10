"use client";
import { Button } from "@/components/ui/button";
import useConversation from "@/hooks/user-conversation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

import { Send } from "lucide-react";

import { MessageInput } from "./message-input";

interface FormProps {
  disabled: boolean;
  phone: string;
  defaultPhone: string;
}
export const Form = ({ disabled, phone, defaultPhone }: FormProps) => {
  const { conversationId } = useConversation();

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
    // console.log(data);
    // return;
    axios
      .post("/api/sms/out", {
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
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
