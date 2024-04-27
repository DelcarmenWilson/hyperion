"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { USDollar } from "@/formulas/numbers";

type FieldBoxProps = {
  name: string;
  field: string;
  maxLength?: number;
  onFieldUpdate: (e?: string) => void;
};
export const FieldBox = ({
  name,
  field,
  maxLength = 6,
  onFieldUpdate,
}: FieldBoxProps) => {
  const [fieldEnabled, setFieldEnabled] = useState(false);
  const [newField, setNewField] = useState(field);

  const onCancel = () => {
    setFieldEnabled(false);
  };

  const onUpdate = () => {
    onFieldUpdate(newField);
    setFieldEnabled(false);
  };
  return (
    <div className="flex gap-1 items-center group">
      <span>{name}:</span>
      {fieldEnabled ? (
        <Input
          className="w-[60px] h-5"
          maxLength={maxLength}
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          type="number"
        />
      ) : (
        <span className={field ? "font-semibold" : "text-primary"}>
          {field ? `$${field}` : "Not set"}
        </span>
      )}
      {fieldEnabled ? (
        <div className="flex gap-1">
          <Button variant="link" size="sm" onClick={onCancel}>
            <X size={16} />
          </Button>

          <Button variant="link" size="sm" onClick={onUpdate}>
            <Check size={16} />
          </Button>
        </div>
      ) : (
        <Button
          variant="link"
          size="sm"
          className="opacity-0 group-hover:opacity-100"
          onClick={() => setFieldEnabled(true)}
        >
          <Pencil size={16} />
        </Button>
      )}
    </div>
  );
};
