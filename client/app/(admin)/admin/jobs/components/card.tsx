"use client";
import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useJobStore } from "../hooks/use-store";
import { useJobActions } from "../hooks/use-job";

import { Job } from "@prisma/client";

import { AlertModal } from "@/components/modals/alert";
import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";
import { JobFormDrawer } from "./form";
import { Switch } from "@/components/ui/switch";

import { formatDate } from "@/formulas/dates";

type JobCardProps = {
  job: Job;
};

export const JobCard = ({ job }: JobCardProps) => {
  const { setJob, onJobFormOpen } = useJobStore();
  const { onJobDelete, jobDeleting } = useJobActions();
  const [alertOpen, setAlertOpen] = useState(false);

  // const onJobPublished = async (e: boolean) => {
  //   setPublished(e);

  //   setLoading(true);
  //   const updatedJob = await jobUpdateByIdPublished(job.id, e);
  //   if (updatedJob.success) {
  //     toast.success(updatedJob.success);
  //   } else toast.error(updatedJob.error);

  //   setLoading(false);
  // };

  return (
    <>
      <AlertModal
        title="Want to delete this job?"
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => {
          onJobDelete(job.id);
          setAlertOpen(false);
        }}
        loading={jobDeleting}
        height="h-200"
      />
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center capitalize">{`${job.headLine}`}</h3>
        <div className="flex justify-end gap-2">
          <p className="font-semibold">Published:</p>
          {/* <Switch
            name="cblPublished"
            disabled={loading}
            checked={published}
            onCheckedChange={onJobPublished}
          /> */}
        </div>
        <CardData label="Status" value={job.status} />

        <CardData label="Category" value={job.category} />
        <CardData label="Description" value={job.description} column />
        <CardData label="Start Date" value={formatDate(job.startAt)} />
        <CardData label="End Date" value={formatDate(job.endAt)} />

        <div className="flex group gap-2 justify-end items-center  mt-auto pt-2 border-t">
          <Button
            variant="destructive"
            size="sm"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
          >
            <Trash size={16} />
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setJob(job);
              onJobFormOpen();
            }}
          >
            <Edit size={16} />
          </Button>
          <Button size="sm" asChild>
            <Link href={`/admin/jobs/${job.id}`}>Details</Link>
          </Button>
        </div>
      </div>
    </>
  );
};
