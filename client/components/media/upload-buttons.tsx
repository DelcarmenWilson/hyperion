"use client";
import React from "react";
import { useModal } from "@/providers/modal";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/global/custom-modal";
import MediaForm from "./form";

const MediaUploadButton = () => {
  const { setOpen } = useModal();

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Upload Media"
            subheading="Upload a file to your media bucket"
          >
            <MediaForm />
          </CustomModal>
        );
      }}
    >
      Upload
    </Button>
  );
};

export default MediaUploadButton;
