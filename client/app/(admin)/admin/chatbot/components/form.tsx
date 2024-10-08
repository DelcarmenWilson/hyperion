import { useChatbotActions } from "../hooks/use-chatbot";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/global/custom-dialog";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ChatSettingsForm = ({ isOpen, onClose }: Props) => {
  const { loading, form, onCancel, onChatbotSettingsSubmit } =
    useChatbotActions(onClose);

  return (
    <CustomDialog
      open={isOpen}
      onClose={onClose}
      title="Chat Settings"
      description=" Chat Settings Form"
    >
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
              <Button onClick={onCancel} type="button" variant="outlineprimary">
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomDialog>
  );
};
