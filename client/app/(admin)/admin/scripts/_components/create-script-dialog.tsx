"use client";

import { useCallback, useState } from "react";
import { Layers2Icon, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { LeadType } from "@/types/lead";
import { createScriptSchema, createScriptSchemaType } from "@/schemas/script";

import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LeadTypeSelect } from "@/components/lead/select/type-select";
import { Textarea } from "@/components/ui/textarea";

import { createScript } from "@/actions/script/create-script";

const CreateScriptDialog = ({ triggerText }: { triggerText?: string }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<createScriptSchemaType>({
    resolver: zodResolver(createScriptSchema),
    defaultValues: { type: LeadType.General },
  });

  const scriptMutation = useMutation({
    mutationFn: createScript,
    onSuccess: () => {
      toast.success("Script created", { id: "create-script" });
      setOpen(false);
    },
    onError: () => {
      toast.error("Somthing went wrong", { id: "create-script" });
    },
  });

  const OnSubmit = useCallback(
    (values: createScriptSchemaType) => {
      toast.loading("Creating new script...", { id: "create-script" });
      scriptMutation.mutate(values);
    },
    [scriptMutation.mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        form.reset();
        setOpen(e);
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create Script"}</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Create Script"
          subTitle="Create a new awesome script"
        />

        {/* FORM */}
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-4 w-full"
              onSubmit={form.handleSubmit(OnSubmit)}
            >
              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive unique name
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* TYPE */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Type
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <LeadTypeSelect
                        id="111"
                        type={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>Choose a lead type</FormDescription>
                  </FormItem>
                )}
              />

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-xs text-primary">(optional)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what your script will be
                      informing you of. <br /> This is optional but can help you
                      remember the script&apos;s purpose
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={scriptMutation.isPending}
              >
                {scriptMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Proceed"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScriptDialog;
