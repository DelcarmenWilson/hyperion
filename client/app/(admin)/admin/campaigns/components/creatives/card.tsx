"use client";
import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { CampaignCreative } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";
import { CreativeForm } from "./form";

import { formatDate } from "@/formulas/dates";
import { campaignCreativeDeleteById } from "@/actions/facebook/creative";

type Props = {
  initCreative: CampaignCreative;
  onCreativeDeleted: (e: string) => void;
};

export const CreativeCard = ({ initCreative, onCreativeDeleted }: Props) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [creative, setCreative] = useState(initCreative);

  const {
    id,
    account_id,
    name,
    title,
    body,
    call_to_action_type,
    image_hash,
    image_url,
    object_type,
    thumbnail_url,
    video_id,
    status,
    created_at,
    updated_at,
  } = creative;

  const onCreativeUpdated = (e?: CampaignCreative) => {
    if (e) setCreative(e);
    setIsOpen(false);
  };

  const onDeleteCreative = async () => {
    setLoading(true);
    const deletedCreative = await campaignCreativeDeleteById(creative.id);

    if (deletedCreative.success) {
      onCreativeDeleted(creative.id);
      toast.success(deletedCreative.success);
    } else toast.error(deletedCreative.error);

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
        title="Want to delete this creative"
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteCreative}
        loading={loading}
        height="h-200"
      />
      <DrawerRight
        title="Edit Creative"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <CreativeForm creative={creative} onClose={onCreativeUpdated} />
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
        <CardData label="Description" value={title} column />
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
            <Link href={`/admin/tasks/${creative.id}`}>Details</Link>
          </Button>
        </div>
      </div>
    </>
  );
};
