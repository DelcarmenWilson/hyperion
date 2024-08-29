import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CampaignFormSchema, CampaignFormSchemaType } from "@/schemas/campaign";

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

import { Textarea } from "@/components/ui/textarea";
import { campaignFormInsert } from "@/actions/admin/campaign";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const FormForm = ({ isOpen, onClose }: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<CampaignFormSchemaType>({
    resolver: zodResolver(CampaignFormSchema),
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onFormSubmit = async (values: CampaignFormSchemaType) => {
    setLoading(true);
    const response = await campaignFormInsert(values);
    if (response.success) {
      toast.success("Campaign Form created !!");
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
        <h3 className="text-2xl font-semibold py-2">New Campaign</h3>
        <div className="h-full overflow-y-auto">
          <Form {...form}>
            <form
              className="space-y-2 px-2 w-full"
              onSubmit={form.handleSubmit(onFormSubmit)}
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

              {/* HEADLINE */}
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Headline"
                        disabled={loading}
                        autoComplete="Headline"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BODY */}
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Body"
                        disabled={loading}
                        autoComplete="Body"
                        rows={8}
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
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
