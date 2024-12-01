"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ImageModal } from "@/components/modals/image";

import { updateUserImage } from "@/actions/user";

export const ProfileImage = ({ image }: { image: string }) => {
  const { update } = useSession();
  const [modalOpen, setModalOpen] = useState(false);

  const onImageUpdated = async (images: string[]) => {
    setModalOpen(false);
    const imageUpdated = await updateUserImage(images[0]);

    update();
    toast.success(imageUpdated);
  };
  return (
    <>
      <ImageModal
        title="Change Profile image?"
        filePath="users"
        oldFile={image}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onImageUpdate={onImageUpdated}
      />
      <div className="flex mb-2 gap-2 items-center justify-center">
        <div className="relative text-center overflow-hidden rounded-full shadow-lg shadow-primary  group">
          <Image
            width={100}
            height={100}
            className="rounded-full  w-[100px] aspect-square"
            src={image || "/assets/defaults/teamImage.jpg"}
            alt="Profile Image"
            loading="lazy"
            priority={false}
          />
          <Button
            className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100"
            variant="secondary"
            onClick={() => setModalOpen(true)}
          >
            CHANGE
          </Button>
        </div>
      </div>
    </>
  );
};
