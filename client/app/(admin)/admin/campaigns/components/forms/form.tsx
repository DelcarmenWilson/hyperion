import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CampaignForm } from "@prisma/client";

import { CampaignFormSchema, CampaignFormSchemaType } from "@/schemas/campaign";

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

import {
  campaignFormInsert,
  campaignFormUpdateById,
} from "@/actions/facebook/form";

type Props = {
  initForm?: CampaignForm | null;
  onClose?: (e?: CampaignForm) => void;
};

export const FormForm = ({ initForm, onClose }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  //TODO - Need to come pack and work on this entirely
  const form = useForm<CampaignFormSchemaType>({
    resolver: zodResolver(CampaignFormSchema),
    //@ts-ignore
    defaultValues: initForm || {},
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: CampaignFormSchemaType) => {
    setLoading(true);

    if (initForm) {
      const updatedForm = await campaignFormUpdateById(values);
      if (updatedForm.success) {
        toast.success(updatedForm.success);
        router.refresh();
      } else {
        form.reset();
        toast.error(updatedForm.error);
      }
    } else {
      const insertedForm = await campaignFormInsert(values);
      if (insertedForm.success) {
        form.reset();
        if (onClose) onClose(insertedForm.success);
        toast.success("Form created!");
      } else toast.error(insertedForm.error);
    }

    setLoading(false);
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Name
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g Sample Form"
                      disabled={loading}
                      autoComplete="Name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* PRIVACY POLICY URL*/}
            <FormField
              control={form.control}
              name="privacy_policy_url"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    privacy policy url
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="e.g Sample title"
                      disabled={loading}
                      autoComplete="title"
                      rows={4}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {form ? "Update" : "Create"} Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
