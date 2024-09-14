import * as z from "zod";
import { useEffect, useState } from "react";
import { Plus, Send } from "lucide-react";
import { useGlobalContext } from "@/providers/global";

import { userEmitter } from "@/lib/event-emmiter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLeadData, useLeadStore } from "@/hooks/lead/use-lead";
import { useLeadMessageActions } from "@/hooks/lead/use-message";

import { SmsMessageSchema, SmsMessageSchemaType } from "@/schemas/message";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { UserTemplate } from "@prisma/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageGrid } from "@/components/reusable/image-grid";
import { replacePreset } from "@/formulas/text";
import { TemplateList } from "@/app/(pages)/settings/(routes)/config/components/templates/list";

export const SmsForm = () => {
  const { user, templates } = useGlobalContext();
  const { lead } = useLeadData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attachment, setAttachment] = useState<string[]>([]);

  const form = useForm<SmsMessageSchemaType>({
    resolver: zodResolver(SmsMessageSchema),
    defaultValues: {
      content: "",
      type: "sms",
    },
  });
  const disabled: boolean =
    !form.getValues("content") && !form.getValues("images");

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    setAttachment([]);
  };

  const { onMessageInsertSubmit, IsPendingInsertMessage } =
    useLeadMessageActions(onCancel);

  const onAttachmentRemove = (e: number) => {
    setAttachment([]);
    form.setValue("images", undefined);
  };

  useEffect(() => {
    const onTemplateSelected = (tp: UserTemplate) => {
      if (tp.attachment) {
        setAttachment([tp.attachment]);
        form.setValue("images", tp.attachment);
      }
      if (tp.message) {
        const message = replacePreset(tp.message, user!, lead!);
        form.setValue("content", message);
      }
      setDialogOpen(false);
    };
    userEmitter.on("templateSelected", (info) => onTemplateSelected(info));
    return () => {
      userEmitter.on("templateSelected", (info) => onTemplateSelected(info));
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex flex-col justify-start h-full max-w-screen-lg">
          <h3 className="text-2xl font-semibold text-primary">Templates</h3>
          <TemplateList templates={templates!} showSelect />
        </DialogContent>
      </Dialog>
      <div>
        <Form {...form}>
          <form
            className="space-6 px-2 w-full"
            onSubmit={form.handleSubmit(onMessageInsertSubmit)}
          >
            <ImageGrid
              images={attachment}
              header={false}
              bgSize={40}
              onImageRemove={onAttachmentRemove}
            />
            <div className="flex items-center p-2 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon">
                    <Plus size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60" align="center">
                  {/* <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => OnSetAttachment(tp)}
                    >
                      {tp.name}
                    </DropdownMenuItem> */}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    onClick={() => setDialogOpen(true)}
                  >
                    Templates
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="message"
                        disabled={IsPendingInsertMessage}
                        autoComplete="Message"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="rounded-md"
                size="icon"
                disabled={IsPendingInsertMessage || disabled}
                type="submit"
              >
                <Send size={16} />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
