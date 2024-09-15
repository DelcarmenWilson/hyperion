import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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

import { CampaignSchema, CampaignSchemaType } from "@/schemas/campaign";
import { campaignInsert } from "@/actions/facebook/campaign";
import { TargetSelect } from "./select";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CampaignForm = ({ isOpen, onClose }: Props) => {
  const [loading, setLoading] = useState(false);

  // const { data: campaign, isFetching: isFetchingCampaign } =
  // useQuery<Campaign | null>({
  //   queryFn: () => campaignsGetById(),
  //   queryKey: ["campaign"],
  // });

  const form = useForm<CampaignSchemaType>({
    resolver: zodResolver(CampaignSchema),
    defaultValues: { status: "paused", start_time: new Date() },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onCampaignFormSubmit = async (values: CampaignSchemaType) => {
    setLoading(true);
    const response = await campaignInsert(values);
    if (response.success) {
      toast.success("Campaign created !!");
      onClose();
    } else {
      onCancel();
      toast.error(response.error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogDescription className="hidden">Campaign Form</DialogDescription>
      <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
        <h3 className="text-2xl font-semibold py-2">New Campaign</h3>
        <div className="h-full overflow-y-auto">
          <Form {...form}>
            <form
              className="space-y-2 px-2 w-full"
              onSubmit={form.handleSubmit(onCampaignFormSubmit)}
            >
              {/* ID */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Id</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Id"
                        disabled={loading}
                        autoComplete="Id"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* OBJECTIVE */}
              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objective</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Objective"
                        disabled={loading}
                        autoComplete="Objective"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* STATUS */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Status"
                        disabled={loading}
                        autoComplete="Status"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TARGETID */}
              {/* <FormField
                control={form.control}
                name="target_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TargetId</FormLabel>
                    <FormControl>
                      <TargetSelect {...field} />
                     
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

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
