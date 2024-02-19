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
  setField: (e: string) => void;
  onFieldUpdate: () => void;
};
export const FieldBox = ({
  name,
  field,
  maxLength = 4,
  setField,
  onFieldUpdate,
}: FieldBoxProps) => {
  const [fieldOldField, setOldField] = useState(field);
  const [fieldEnabled, setFieldEnabled] = useState(false);
  const onFieldChange = (num: string) => {
    if (num != "" && !parseInt(num)) return;
    setField(num);
  };

  const onCancel = () => {
    setField(fieldOldField || "");
    setFieldEnabled(false);
  };

  const onUpdate = () => {
    onFieldUpdate();
    setFieldEnabled(false);
  };
  return (
    <div className="flex gap-1 items-center group">
      <span>{name}:</span>
      {fieldEnabled ? (
        <Input
          className="w-[60px] h-5"
          maxLength={maxLength}
          value={field}
          onChange={(e) => onFieldChange(e.target.value)}
        />
      ) : (
        <span className={field ? "font-semibold" : "text-destructive"}>
          {field ? USDollar.format(parseInt(field)) : "Not set"}
        </span>
      )}
      {fieldEnabled ? (
        <div className="flex gap-1">
          <Button variant="link" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>

          <Button variant="link" size="sm" onClick={onUpdate}>
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="link"
          size="sm"
          className="opacity-0 group-hover:opacity-100"
          onClick={() => setFieldEnabled(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
