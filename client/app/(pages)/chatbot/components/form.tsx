import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { daysOfTheWeek } from "@/formulas/schedule";
import { GptSettingsSchema, GptSettingsSchemaType } from "@/schemas/test";
import { Textarea } from "@/components/ui/textarea";
import { gptSettingsInsert } from "@/actions/test";
import { toast } from "sonner";

export const ChatbotForm = ({isOpen,onClose}:{isOpen:boolean; onClose:()=>void}) => {
  const form = useForm<GptSettingsSchemaType>({
    resolver: zodResolver(GptSettingsSchema),
    defaultValues: {id:""}
  });

  const ChatbotFormSubmit = async (values: GptSettingsSchemaType) => {

const insertedChatbot= await gptSettingsInsert(values)

if(insertedChatbot.error)

  {toast.error(insertedChatbot.error)}

else
{toast.success("settings have been updated") 

  console.log(insertedChatbot.success)
}


  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <h3 className="text-2xl font-semibold py-2">GPT Settings</h3>
        <div className="flex-col items-start xl:flex-row xl:items-center max-h-[400px] p-2 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(ChatbotFormSubmit)}
              className="space-y-2"
            >
              {/* Prompt */}
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Prompt
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                    <Textarea {...field} rows={10} placeholder="Please start prompting" />
                      
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Lead Info */}
              <FormField
                control={form.control}
                name="leadInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Lead Info
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={10} placeholder="Please enter Lead Info" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex mt-2 gap-2 justify-end">
                <Button
                  variant="outlineprimary"
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button>Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
