import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { CampaignAudience } from "@prisma/client";
import {
  CampaignAudienceSchema,
  CampaignAudienceSchemaType,
} from "@/schemas/campaign";

import {
  campaignAudienceInsert,
  campaignAudienceUpdateById,
} from "@/actions/facebook/audience";

type Props = {
  audience?: CampaignAudience | null;
  onClose?: (e?: CampaignAudience) => void;
};

export const AudienceForm = ({ audience, onClose }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  //TODO - Need to come pack and work on this entirely
  const form = useForm<CampaignAudienceSchemaType>({
    resolver: zodResolver(CampaignAudienceSchema),
    //@ts-ignore
    defaultValues: audience || {
      run_status: "PAUSED",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: CampaignAudienceSchemaType) => {
    setLoading(true);

    if (audience) {
      const updatedAudience = await campaignAudienceUpdateById(values);
      if (updatedAudience.success) {
        toast.success(updatedAudience.success);
        router.refresh();
      } else {
        form.reset();
        toast.error(updatedAudience.error);
      }
    } else {
      const insertedAudience = await campaignAudienceInsert(values);
      if (insertedAudience.success) {
        form.reset();
        if (onClose) onClose(insertedAudience.success);
        toast.success("Audience created!");
      } else toast.error(insertedAudience.error);
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
                      placeholder="e.g Sample Audience"
                      disabled={loading}
                      autoComplete="Name"
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
              {audience ? "Update" : "Create"} Audience
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
