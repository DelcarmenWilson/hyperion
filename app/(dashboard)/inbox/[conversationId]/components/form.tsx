"use client";
import { Button } from "@/components/ui/button";
import useConversation from "@/hooks/user-conversation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

import { Send } from "lucide-react";

import { MessageInput } from "./message-input";

export const Form = () => {
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
    axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  };

  return (
    <div className="p-4 border-t flex items-center gap-2 lg:gap-4 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          type="text"
          register={register}
          required
          errors={errors}
          placeholder="Write a message..."
        />
        <Button size="icon" type="submit" className="rounded-full">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};