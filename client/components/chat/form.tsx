import React, { useContext, useEffect, useRef, useState } from "react";
import SocketContext from "@/providers/socket";
import { Plus, Send } from "lucide-react";
import { useGlobalContext } from "@/providers/global";
import { useChat, useChatActions } from "@/hooks/use-chat";

import { userEmitter } from "@/lib/event-emmiter";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserTemplate } from "@prisma/client";

import { ChatMessageSchema, ChatMessageSchemaType } from "@/schemas/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageGrid } from "@/components/reusable/image-grid";
import { Textarea } from "@/components//ui/textarea";

import { TemplateList } from "@/app/(pages)/settings/(routes)/config/components/templates/list";

export const ChatForm = () => {
  const { user, templates } = useGlobalContext();
  const { socket } = useContext(SocketContext).SocketState;
  const { user: agent, chatId } = useChat();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [attachment, setAttachment] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<ChatMessageSchemaType>({
    resolver: zodResolver(ChatMessageSchema),
    defaultValues: {
      chatId,
      content: "",
      senderId: user?.id as string,
      userId: agent?.id,
    },
  });
  const reset = () => {
    form.clearErrors();
    form.reset();
    setAttachment([]);
  };

  const { loading, onChatMessageInsert } = useChatActions(
    chatId as string,
    reset
  );

  const disabled: boolean =
    !form.getValues("content") && !form.getValues("attachment");

  const onAttachmentRemove = () => {
    setAttachment([]);
    form.setValue("attachment", undefined);
  };

  const onTemplateSelected = (tp: UserTemplate) => {
    if (tp.attachment) {
      setAttachment([tp.attachment]);
      form.setValue("attachment", tp.attachment);
    }
    setDialogOpen(false);
  };

  useEffect(() => {
    form.setValue("chatId", chatId);
  }, [chatId]);

  // useEffect(() => {
  //   socket?.on("chat-message-received", (cid: string) => {
  //     console.log(cid, chatId);
  //     if (cid == chatId) invalidate();
  //   });
  // }, []);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current?.scrollHeight + "px";
  }, [form.getValues("content")]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogDescription className="hidden">Chat Form</DialogDescription>
        <DialogContent className="flex flex-col justify-start h-full max-w-screen-lg">
          <h3 className="text-2xl font-semibold text-primary">Templates</h3>
          <TemplateList onSelect={onTemplateSelected} />
        </DialogContent>
      </Dialog>
      <div>
        <Form {...form}>
          <form
            className="space-6 px-2 w-full"
            onSubmit={form.handleSubmit(onChatMessageInsert)}
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
                      {/* <Input
                        {...field}
                        placeholder="message"
                        disabled={loading}
                        autoComplete="off"
                        type="text"
                        ref={inputRef}
                        autoFocus
                      /> */}
                      <Textarea
                        {...field}
                        className="resize-none"
                        placeholder="Type a message"
                        disabled={loading}
                        autoComplete="off"
                        rows={1}
                        ref={textareaRef}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="rounded-md"
                size="icon"
                disabled={loading || disabled}
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
