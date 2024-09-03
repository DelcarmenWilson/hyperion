import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CampaignCreative } from "@prisma/client";

import {
  CampaignCreativeSchema,
  CampaignCreativeSchemaType,
} from "@/schemas/campaign";

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
  campaignCreativeInsert,
  campaignCreativeUpdateById,
} from "@/actions/facebook/creative";

type Props = {
  creative?: CampaignCreative | null;
  onClose?: (e?: CampaignCreative) => void;
};

export const CreativeForm = ({ creative, onClose }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  //TODO - Need to come pack and work on this entirely
  const form = useForm<CampaignCreativeSchemaType>({
    resolver: zodResolver(CampaignCreativeSchema),
    //@ts-ignore
    defaultValues: creative || {
      call_to_action_type: "SIGN_UP",
      object_type: "SHARE",
      status: "PAUSED",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: CampaignCreativeSchemaType) => {
    setLoading(true);

    if (creative) {
      const updatedCreative = await campaignCreativeUpdateById(values);
      if (updatedCreative.success) {
        toast.success(updatedCreative.success);
        router.refresh();
      } else {
        form.reset();
        toast.error(updatedCreative.error);
      }
    } else {
      const insertedCreative = await campaignCreativeInsert(values);
      if (insertedCreative.success) {
        form.reset();
        if (onClose) onClose(insertedCreative.success);
        toast.success("Creative created!");
      } else toast.error(insertedCreative.error);
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
                      placeholder="e.g Sample Creative"
                      disabled={loading}
                      autoComplete="Name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* TITLE*/}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Title
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
              {creative ? "Update" : "Create"} Creative
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
