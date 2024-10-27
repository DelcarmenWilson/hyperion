"use client";
import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Job } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";
import { Switch } from "@/components/ui/switch";
import { JobForm } from "./form";

import { formatDate } from "@/formulas/dates";

type JobCardProps = {
  initJob: Job;
  onJobDeleted: (e: string) => void;
};

export const JobCard = ({ initJob, onJobDeleted }: JobCardProps) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [job, setJob] = useState(initJob);

  const onJobUpdated = (e?: Job) => {
    if (e) setJob(e);
    setIsOpen(false);
  };

  // const onDeleteJob = async () => {
  //   setLoading(true);
  //   const deletedJob = await jobDeleteById(job.id);

  //   if (deletedJob.success) {
  //     onJobDeleted(job.id);
  //     toast.success(deletedJob.success);
  //   } else toast.error(deletedJob.error);

  //   setAlertOpen(false);
  //   setLoading(false);
  // };

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
      {/* <AlertModal
        title="Want to delete this job"
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteJob}
        loading={loading}
        height="h-200"
      /> */}
      <DrawerRight
        title="Edit Job"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <JobForm job={job} onClose={onJobUpdated} />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${job.headLine}`}</h3>
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
          <Button size="sm" onClick={() => setIsOpen(true)}>
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
