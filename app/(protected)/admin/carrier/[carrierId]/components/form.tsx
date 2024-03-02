"use client";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Carrier } from "@prisma/client";
import { CarrierSchema } from "@/schemas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { ImageModal } from "@/components/modals/image-modal";
import { adminCarrierUpdateById } from "@/actions/admin";

type CarrierFormProps = {
  carrier: Carrier;
};

type CarrierFormValues = z.infer<typeof CarrierSchema>;

export const CarrierForm = ({ carrier }: CarrierFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(carrier.image);
  const [modalOpen, setModalOpen] = useState(false);

  const form = useForm<CarrierFormValues>({
    resolver: zodResolver(CarrierSchema),
    defaultValues: carrier,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
  };

  const onSubmit = async (values: CarrierFormValues) => {
    console.log(values);
    setLoading(true);
    await adminCarrierUpdateById(values).then((data) => {
      if (data.success) {
        router.refresh();
        toast.success(data.success);
      }
      if (data.error) {
        toast.error(data.error);
      }
    });

    setLoading(false);
  };

  const onImageUpdated = (e: string) => {
    setModalOpen(false);
    setImage(e);
    router.refresh();

    toast.success("Carrier Image has been updated");
  };
  return (
    <>
      <ImageModal
        title="Change carrier image?"
        id={carrier.id}
        type="carrier"
        filePath="assets/carriers"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onImageUpdate={onImageUpdated}
      />
      <div className="flex justify-center items-center w-full my-4">
        <div className="relative text-center overflow-hidden rounded-md group">
          <Image
            width={80}
            height={80}
            className="rounded-md shadow-sm shadow-white h-auto w-[250px]"
            src={image || "/assets/defaults/teamImage.jpg"}
            alt="Team Image"
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
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="name"
                        disabled={loading}
                        autoComplete="name"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WEBSITE */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Website"
                        disabled={loading}
                        type="text"
                        autoComplete="website"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PORTAL */}
              <FormField
                control={form.control}
                name="portal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Agent Portal</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="portal"
                        disabled={loading}
                        autoComplete="Portal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col">
              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Description"
                        disabled={loading}
                        rows={6}
                        autoComplete="description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-x-2 justify-between mt-3">
                <Button onClick={onCancel} type="button" variant="outline">
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  Update
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
