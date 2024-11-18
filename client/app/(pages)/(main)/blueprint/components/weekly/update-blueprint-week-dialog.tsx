import React, { useState } from "react";
import { Loader2, Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBluePrintActions } from "@/hooks/use-blueprint";

import {
  UpdateBluePrintWeekSchema,
  UpdateBluePrintWeekSchemaType,
} from "@/schemas/blueprint";

import { Button } from "@/components/ui/button";
import { BluePrintWeek } from "@prisma/client";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const UpdateBluePrintWeekDialog = ({
  bluePrintWeek,
}: {
  bluePrintWeek: BluePrintWeek;
}) => {
  const [open, setOpen] = useState(false);

  const { onBluePrintWeekUpdate, bluePrintWeekUpdating } = useBluePrintActions(
    () => setOpen(false)
  );

  const form = useForm<UpdateBluePrintWeekSchemaType>({
    resolver: zodResolver(UpdateBluePrintWeekSchema),
    defaultValues: bluePrintWeek,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">Edit Details</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={Target}
          title="Edit current week blueprint (Test)"
        />

        <div className="col flex-col items-start gap-2 xl:flex-row xl:items-center max-h-[400px] p-2 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onBluePrintWeekUpdate)}>
              {/* CALLS */}
              <FormField
                control={form.control}
                name="calls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Calls
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Calls Made" />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* APPOINTMENTS */}
              <FormField
                control={form.control}
                name="appointments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Appointments
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Appointments Made" />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* PREMIUM */}
              <FormField
                control={form.control}
                name="premium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Premium
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Premium Earned" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 mt-2 gap-2">
                <Button
                  variant="outlineprimary"
                  type="button"
                  disabled={bluePrintWeekUpdating}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="gap-2"
                  disabled={!form.formState.isDirty || bluePrintWeekUpdating}
                >
                  {bluePrintWeekUpdating ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span> Updating Details</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBluePrintWeekDialog;
