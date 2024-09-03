import { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { LeadMainSchema, LeadMainSchemaType } from "@/schemas/lead";
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

import { leadUpdateByIdMainInfo } from "@/actions/lead";

import { states } from "@/constants/states";
import {
  ChatbotSettingsSchema,
  ChatbotSettingsSchemaType,
} from "@/schemas/chatbot";
import {
  chatbotMessageInsert,
  chatbotSettingsInsert,
  chatbotSettingsUpsert,
} from "@/actions/chatbot";
import { Textarea } from "@/components/ui/textarea";
import { useChatbotActions } from "../hooks/use-chatbot";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ChatSettingsForm = ({ isOpen, onClose }: Props) => {
  const { loading, form, onCancel, onChatbotSettingsSubmit } =
    useChatbotActions(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-full">
        <h3 className="text-2xl font-semibold py-2">Chat Settings</h3>
        <div className="h-full overflow-y-auto">
          <Form {...form}>
            <form
              className="space-y-2 px-2 w-full"
              onSubmit={form.handleSubmit(onChatbotSettingsSubmit)}
            >
              {/* PROMPT */}
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Prompt"
                        disabled={loading}
                        autoComplete="Prompt"
                        rows={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LEAD INFO */}
              <FormField
                control={form.control}
                name="leadInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Lead Info"
                        disabled={loading}
                        autoComplete="Lead Info"
                        rows={10}
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
