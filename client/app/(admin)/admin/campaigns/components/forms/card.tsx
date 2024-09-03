"use client";
import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { CampaignForm } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";
import { FormForm } from "./form";

import { formatDate } from "@/formulas/dates";
import { campaignFormDeleteById } from "@/actions/facebook/form";

type Props = {
  initForm: CampaignForm;
  onFormDeleted: (e: string) => void;
};

export const FormCard = ({ initForm, onFormDeleted }: Props) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initForm);

  const {
    id,
    name,
    allow_organic_lead,
    block_display_for_non_targeted_viewer,
    expired_leads_count,
    follow_up_action_url,
    leads_count,
    privacy_policy_url,
    question_page_custom_headline,
    status,
    created_at,
    updated_at,
  } = form;

  const onFormUpdated = (e?: CampaignForm) => {
    if (e) setForm(e);
    setIsOpen(false);
  };

  const onDeleteForm = async () => {
    setLoading(true);
    const deletedForm = await campaignFormDeleteById(form.id);

    if (deletedForm.success) {
      onFormDeleted(form.id);
      toast.success(deletedForm.success);
    } else toast.error(deletedForm.error);

    setAlertOpen(false);
    setLoading(false);
  };

  // const onTaskPublished = async (e: boolean) => {
  //   setPublished(e);

  //   setLoading(true);
  //   const updatedTask = await taskUpdateByIdPublished(task.id, e);
  //   if (updatedTask.success) {
  //     toast.success(updatedTask.success);
  //   } else toast.error(updatedTask.error);

  //   setLoading(false);
  // };

  return (
    <>
      <AlertModal
        title="Want to delete this form"
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteForm}
        loading={loading}
        height="h-200"
      />
      <DrawerRight
        title="Edit Form"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <FormForm initForm={form} onClose={onFormUpdated} />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${name}`}</h3>
        <div className="flex justify-end gap-2">
          {/* <p className="font-semibold">Published:</p>
          <Switch
            name="cblPublished"
            disabled={loading}
            checked={published}
            onCheckedChange={onTaskPublished}
          /> */}
        </div>
        <CardData label="Status" value={status} />
        <CardData label="Create Date" value={formatDate(created_at)} />
        <CardData label="Updated Date" value={formatDate(updated_at)} />
        <div className="flex group gap-2 justify-end items-center  mt-auto pt-2 border-t">
          <Button
            variant="destructive"
            size="sm"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
          >
            <Trash size={16} />
          </Button>
          <Button size="sm" onClick={() => setIsOpen(true)}>
            <Edit size={16} />
          </Button>
          <Button size="sm" asChild>
            <Link href={`/admin/tasks/${form.id}`}>Details</Link>
          </Button>
        </div>
      </div>
    </>
  );
};
