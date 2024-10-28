"use client";
import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { CampaignAudience } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer/right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";
import { AudienceForm } from "./form";

import { formatDate } from "@/formulas/dates";
import { campaignAudienceDeleteById } from "@/actions/facebook/audience";

type Props = {
  initAudience: CampaignAudience;
  onAudienceDeleted: (e: string) => void;
};

export const AudienceCard = ({ initAudience, onAudienceDeleted }: Props) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [audience, setAudience] = useState(initAudience);

  const { id, account_id, name, run_status, created_at, updated_at } = audience;

  const onAudienceUpdated = (e?: CampaignAudience) => {
    if (e) setAudience(e);
    setIsOpen(false);
  };

  const onDeleteAudience = async () => {
    setLoading(true);
    const deletedAudience = await campaignAudienceDeleteById(audience.id);

    if (deletedAudience.success) {
      onAudienceDeleted(audience.id);
      toast.success(deletedAudience.success);
    } else toast.error(deletedAudience.error);

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
        title="Want to delete this audience"
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteAudience}
        loading={loading}
        height="h-200"
      />
      <DrawerRight
        title="Edit Audience"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <AudienceForm audience={audience} onClose={onAudienceUpdated} />
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
        <CardData label="Status" value={run_status} />
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
            <Link href={`/admin/tasks/${audience.id}`}>Details</Link>
          </Button>
        </div>
      </div>
    </>
  );
};
