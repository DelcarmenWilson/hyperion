"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminCarriers } from "@/hooks/admin/use-carriers";
import { useAgentCarrierActions } from "../../hooks/use-carrier";

import { FullUserCarrier } from "@/types";
import { UserCarrierSchema, UserCarrierSchemaType } from "@/schemas/user";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer/right";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Textarea } from "@/components/ui/textarea";

type CarrierDrawerProps = {
  carrier?: FullUserCarrier;
  open: boolean;
  onClose: () => void;
};
const CarrierDrawer = ({ carrier, open, onClose }: CarrierDrawerProps) => {
  const title = carrier ? "Edit Carrier" : "New Carrier";
  const { onCreateCarrier, carrierCreating, onUpdateCarrier, carrierUpdating } =
    useAgentCarrierActions(onClose);
  return (
    <DrawerRight title={title} isOpen={open} onClose={onClose}>
      <CarrierForm
        carrier={carrier}
        loading={carrier ? carrierUpdating : carrierCreating}
        onSubmit={carrier ? onUpdateCarrier : onCreateCarrier}
        onClose={onClose}
      />
    </DrawerRight>
  );
};

type CarrierFormProps = {
  carrier?: FullUserCarrier;
  loading: boolean;
  onSubmit: (e: UserCarrierSchemaType) => void;
  onClose: () => void;
};
const CarrierForm = ({
  carrier,
  loading,
  onSubmit,
  onClose,
}: CarrierFormProps) => {
  const { carriers, isFetchingCarriers } = useAdminCarriers();
  const btnText = carrier ? "Update" : "Create";

  const form = useForm<UserCarrierSchemaType>({
    resolver: zodResolver(UserCarrierSchema),
    //@ts-ignore
    defaultValues: carrier || {
      agentId: "",
      carrierId: carriers ? carriers[0].id : "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-6 px-2 w-full overflow-hidden h-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-3">
            {/* CARRIER */}
            <FormField
              control={form.control}
              name="carrierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Carrier
                    <FormMessage />
                  </FormLabel>

                  <SkeletonWrapper isLoading={isFetchingCarriers}>
                    <Select
                      name="ddlCarriers"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      autoComplete="carriers"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Carrier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {carriers?.map((carrier) => (
                          <SelectItem key={carrier.id} value={carrier.id}>
                            {carrier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </SkeletonWrapper>
                </FormItem>
              )}
            />

            {/* AGENTID */}
            <FormField
              control={form.control}
              name="agentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Agent Id
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="FE15745"
                      disabled={loading}
                      autoComplete="agentId"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* RATE */}
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Commision
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="70"
                      disabled={loading}
                      type="number"
                      autoComplete="rate"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* COMMENTS*/}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Comments
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="comments"
                      disabled={loading}
                      rows={5}
                      autoComplete="comments"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>

        <div className="mt-auto grid grid-cols-2 gap-x-2">
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            {btnText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CarrierDrawer;
