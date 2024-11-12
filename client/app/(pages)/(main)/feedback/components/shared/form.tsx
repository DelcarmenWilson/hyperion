"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleFileUpload } from "@/lib/utils";
import { userEmitter } from "@/lib/event-emmiter";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import {
  CreateFeedbackSchema,
  CreateFeedbackSchemaType,
} from "@/schemas/feedback";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardRoutes } from "@/constants/page-routes";

import { Feedback } from "@prisma/client";
import { useCurrentRole } from "@/hooks/user/use-current";
import { ImageModal } from "@/components/modals/image";
import { ImageGrid } from "@/components/reusable/image-grid";
import { createScriptSchemaType } from "@/schemas/script";
import { updateFeedback } from "@/actions/feedback/update-feedback";
import { createFeedback } from "@/actions/feedback/create-feedback";
//TODO - keeping this here for reference will need it tommorrow to complete the image fynctionality for the updatefeedback form
export const FeedbackForm = ({ feedback }: { feedback: Feedback | null }) => {
  const role = useCurrentRole();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<{
    images: string[];
    urls: File[] | undefined;
  }>({
    images: feedback?.images ? feedback.images.split(",") : [],
    urls: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const routes = [...DashboardRoutes].sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  const form = useForm<CreateFeedbackSchemaType>({
    resolver: zodResolver(CreateFeedbackSchema),
    //@ts-ignore
    defaultValues: feedback || {
      headLine: "",
      page: "Dashboard",
      feedback: "",
    },
  });

  const onImagesAdded = (e: string[], fls?: File[]) => {
    setFiles((files) => {
      return {
        images: [...files.images, ...e],
        urls: [...files.urls!, ...fls!],
      };
    });
    setModalOpen(false);
  };

  const onImageRemove = (e: number) => {
    if (e < 0) return;
    const newImages = files.images;
    newImages.splice(e, 1);

    setFiles((files) => {
      return {
        images: newImages,
        urls: files.urls?.splice(e, 1),
      };
    });
  };

  const onCancel = () => {
    form.clearErrors();
    form.reset();
  };

  const onSubmit = async (values: CreateFeedbackSchemaType) => {
    setLoading(true);

    // if (feedback) {
    //   const updatedFeedback = await updateFeedback(values);
    //   if (updatedFeedback.success) {
    //     toast.success("Feedback has been updated");
    //     userEmitter.emit("feedbackUpdated", updatedFeedback.success);
    //     router.refresh();
    //   } else {
    //     form.reset();
    //     toast.error(updatedFeedback.error);
    //   }
    // } else {
    if (files.urls) {
      let urls: string[] = [];
      for (let i = 0; i < files.urls.length; i++) {
        const url = await handleFileUpload({
          newFile: files.urls[i],
          filePath: "feedbacks",
        });
        urls.push(url);
      }
      values.images = urls.join(",");
    }

    const insertedFeedback = await createFeedback(values);

    // if (insertedFeedback.success) {
    //   setFiles({ images: [], urls: [] });
    //   form.reset();
    //   toast.success("Feedback has been created");
    //   userEmitter.emit("feedbackInserted", insertedFeedback.success);
    // } else {
    //   toast.error(insertedFeedback.error);
    // }
    // }

    setLoading(false);
  };
  return (
    <>
      <ImageModal
        title="Upload FeedBack Images?"
        description=""
        filePath="assets/feedbacks"
        multi
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onImageUpdate={onImagesAdded}
        autoUpload={false}
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
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel> Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Dashboard Error"
                      autoComplete="title"
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
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="flex flex-wrap justify-between items-center gap-2">
                    Description
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
      <ImageGrid
        enableButton={role != "MASTER" && feedback?.status != "Resolved"}
        images={files.images}
        setModalOpen={setModalOpen}
        onImageRemove={onImageRemove}
      />
    </>
  );
};
