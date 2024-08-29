import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CampaignTargetAudienceSchema,
  CampaignTargetAudienceSchemaType,
} from "@/schemas/campaign";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { campaignTargetAudienceInsert } from "@/actions/admin/campaign";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const AudienceForm = ({ isOpen, onClose }: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<CampaignTargetAudienceSchemaType>({
    resolver: zodResolver(CampaignTargetAudienceSchema),
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onAudienceFormSubmit = async (
    values: CampaignTargetAudienceSchemaType
  ) => {
    setLoading(true);
    const response = await campaignTargetAudienceInsert(values);
    if (response.success) {
      toast.success("Target audience created !!");
      onClose();
    } else {
      onCancel();
      toast.error(response.error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
        <h3 className="text-2xl font-semibold py-2">New Target Audience</h3>
        <div className="h-full overflow-y-auto">
          <Form {...form}>
            <form
              className="space-y-2 px-2 w-full"
              onSubmit={form.handleSubmit(onAudienceFormSubmit)}
            >
              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Name"
                        disabled={loading}
                        autoComplete="Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AGES */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age(s)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ages"
                        disabled={loading}
                        autoComplete="Ages"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* STATES */}
              <FormField
                control={form.control}
                name="states"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>States</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="States"
                        disabled={loading}
                        autoComplete="States"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
                <Button
                  onClick={onCancel}
                  type="button"
                  variant="outlineprimary"
                >
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
