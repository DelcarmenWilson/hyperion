"use client";
import React, { useState } from "react";
import { CampaignForm } from "@prisma/client";
import { FormCard } from "./card";

type Props = {
  initForms: CampaignForm[];
};
export const FormList = ({ initForms }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [forms, setForms] = useState<CampaignForm[]>(initForms);

  const onFormInserted = (e: CampaignForm) => {
    setForms((forms) => [...forms, e]);
    setIsOpen(false);
  };

  const onFormDeleted = (id: string) => {
    setForms((forms) => forms.filter((e) => e.id !== id));
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      {forms.map((form) => (
        <FormCard key={form.id} initForm={form} onFormDeleted={onFormDeleted} />
      ))}
    </div>
  );
};
