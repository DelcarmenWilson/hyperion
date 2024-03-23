"use client";
import { useState } from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
//TODO see if this can be updated and used
type PasswordInputProps = {
  placeholder?: string;
  id: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  loading: boolean;
};
export const PasswordInput = ({
  placeholder,
  id,
  required,
  register,
  loading,
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full flex items-center">
      <Input
        id={id}
        disabled={loading}
        // {...field}
        placeholder={placeholder}
        type={show ? "text" : "password"}
        autoComplete={id}
        {...register(id, { required })}
      />

      <Button
        onClick={() => setShow(!show)}
        size="sm"
        variant="ghost"
        type="button"
        className="absolute right-0"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </Button>
    </div>
  );
};
