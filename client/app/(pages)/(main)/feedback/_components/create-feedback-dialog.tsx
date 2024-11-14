"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { BriefcaseIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFeedbackActions } from "@/hooks/feedback/use-feedback";

import {
  CreateFeedbackSchema,
  CreateFeedbackSchemaType,
} from "@/schemas/feedback";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CustomDialogHeader from "@/components/custom-dialog-header";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageGrid } from "@/components/reusable/image-grid";
import { ImageModal } from "@/components/modals/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { handleFileUpload } from "@/lib/utils";
import { DashboardRoutes } from "@/constants/page-routes";

const CreateFeedbackDialog = ({
  triggerText = "Create Feedback",
}: {
  triggerText?: string;
}) => {
  const [open, setOpen] = useState(false);

  const [files, setFiles] = useState<{
    images: string[];
    urls: File[] | undefined;
  }>({
    images: [],
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
    defaultValues: {
      page: "Dashboard",
    },
  });

  const { onCreateFeedback, creatingFeedback } = useFeedbackActions(() => {
    onCancel()
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
    setOpen(false);
  };

  const onSubmit = async (values: CreateFeedbackSchemaType) => {
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
    onCreateFeedback(values);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader icon={BriefcaseIcon} title="Create Feedback" />
      
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
      <div className="px-6 py-4">
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
                        autoComplete="HeadLine"
                        disabled={creatingFeedback}
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
                      disabled={creatingFeedback}
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

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="flex flex-wrap justify-between items-center gap-2">
                      Description
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setModalOpen(true)}
                      >
                        Add Attachments
                      </Button>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="If leaving an Error or concern, please be as specific as possible."
                        disabled={creatingFeedback}
                        autoComplete="feedback"
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
              <Button onClick={onCancel} type="button" variant="outline">
                Cancel
              </Button>
              <Button disabled={creatingFeedback} type="submit">
                Create Feedback
              </Button>
            </div>
          </form>
        </Form>
        <ImageGrid
          images={files.images}
          setModalOpen={setModalOpen}
          onImageRemove={onImageRemove}
        />
      </div>
  
      </DialogContent>
    </Dialog>
  );
};



export default CreateFeedbackDialog;
