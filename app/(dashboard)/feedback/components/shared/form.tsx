"use client";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeedbackSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MainSidebarRoutes } from "@/constants/page-routes";
import { feedbackInsert, feedbackUpdateById } from "@/actions/feedback";
import { Feedback } from "@prisma/client";
import { useCurrentRole } from "@/hooks/user-current-role";
import { X } from "lucide-react";
import axios from "axios";
import { ImageModal } from "@/components/modals/image";

type FeedbackFormValues = z.infer<typeof FeedbackSchema>;
type FeedbackFormProps = {
  feedback: Feedback | null;
};

export const FeedbackForm = ({ feedback }: FeedbackFormProps) => {
  const role = useCurrentRole();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>(
    feedback?.images ? feedback.images.split(",") : []
  );
  const [modalOpen, setModalOpen] = useState(false);
  const routes = [...MainSidebarRoutes].sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: feedback || {
      headLine: "aaaa",
      page: "Dashboard",
      feedback: "aaaaaa",
    },
  });

  const onImagesAdded = (e: string[], files: File[]) => {
    setImages((imgs) => [...imgs, ...e]);
    setFiles((fls) => [...fls, ...files]);
    setModalOpen(false);
  };

  const onImageRemove = (e: number) => {
    if (e < 0) return;
    const newImages = images;
    newImages.splice(e, 1);
    setImages(newImages);
    setFiles((files) => {
      files.splice(e, 1);
      return files;
    });
  };

  const onCancel = () => {
    form.clearErrors();
    form.reset();
  };

  const onSubmit = async (values: FeedbackFormValues) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("type", "feedback");
    formData.append("filePath", "assets/feedbacks");

    for (let index = 0; index < images.length; index++) {
      formData.append("image", files[index]);
    }

    if (feedback) {
      feedbackUpdateById(values).then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.refresh();
        }
        if (data.error) {
          form.reset();
          toast.error(data.error);
        }
      });
    } else {
      feedbackInsert(values).then((data) => {
        if (data.success) {
          formData.append("id", data.success);
          axios.post("/api/upload/image", formData);
          toast.success("Feedback has been created");
          router.refresh();
        }
        if (data.error) {
          form.reset();
          toast.error(data.error);
        }
      });
    }

    setLoading(false);
  };
  return (
    <>
      <ImageModal
        title="Upload FeedBack Images?"
        description=""
        id={feedback?.id}
        type="feedback"
        filePath="assets/feedbacks"
        multi
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onImageUpdate={onImagesAdded}
      />
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            {/* HeadLine */}
            <FormField
              control={form.control}
              name="headLine"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel> Head Line</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Dashboard Error"
                      autoComplete="HeadLine"
                      disabled={loading || role == "MASTER"}
                      type="text"
                      maxLength={40}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PAGE */}
            <FormField
              control={form.control}
              name="page"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel> Page</FormLabel>
                  <Select
                    name="ddlPage"
                    disabled={loading || role == "MASTER"}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Page" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.title} value={route.title}>
                          {route.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FEEDBACK */}
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="flex flex-wrap justify-between items-center gap-2">
                    Feedback
                    {role != "MASTER" && feedback?.status != "Resolved" && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setModalOpen(true)}
                      >
                        Add Attachments
                      </Button>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="If leaving an Error or concern, please be as specific as possible."
                      disabled={loading || role == "MASTER"}
                      autoComplete="feedback"
                      rows={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {role != "MASTER" && feedback?.status != "Resolved" && (
            <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
              <Button onClick={onCancel} type="button" variant="outline">
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                {feedback ? "Update" : "Create"} Feedback
              </Button>
            </div>
          )}
        </form>
      </Form>
      <div className="flex flex-wrap gap-2 p-2">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <Image
              width={80}
              height={80}
              className="h-[80px] w-[80px]"
              src={img}
              alt={`Image${index}`}
            />
            <Button
              size="xs"
              className="absolute top-0 right-0 rounded-full opacity-0"
              onClick={() => onImageRemove(index)}
            >
              <X size={12} />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};
