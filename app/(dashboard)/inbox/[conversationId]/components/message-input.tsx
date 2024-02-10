import { Input } from "@/components/ui/input";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  disabled: boolean;
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

export const MessageInput = ({
  disabled,
  placeholder,
  id,
  type,
  required,
  register,
  errors,
}: MessageInputProps) => {
  return (
    <div className="relative w-full">
      <Input
        disabled={disabled}
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
      />
    </div>
  );
};
