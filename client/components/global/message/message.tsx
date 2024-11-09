import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Delta } from "quill/core";
import {
  useChatMessageActions,
  useChatMessageReactionActions,
} from "@/hooks/chat/use-chat";

import { ChatMessageReaction } from "@prisma/client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Hint from "@/components/custom/hint";
import { Reactions } from "./reactions";
import { Thumbnail } from "./thumnail";
import { Toolbar } from "./toolbar";

import { formatDate, formatFullDateTime } from "@/formulas/dates";

const Renderer = dynamic(() => import("@/components/global/message/renderer"), {
  ssr: false,
});
const QuillEditor = dynamic(
  () => import("@/components/custom/quill/quill-editor"),
  {
    ssr: false,
  }
);

type Props = {
  id: string;
  userId: string;
  userImage?: string | null;
  userName?: string | null;
  isAuthor: boolean;
  body?: string | null;
  image?: string | null;
  reactions: ChatMessageReaction[];
  deletedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isEditing: boolean;
  setEditingId: (id: string | null) => void;
  isCompact: boolean;
};
export const Message = ({
  id,
  userId,
  userImage,
  userName = "Member",
  isAuthor,
  body,
  image,
  reactions,
  deletedBy,
  createdAt,
  updatedAt,
  isEditing,
  setEditingId,
  isCompact,
}: Props) => {
  const {
    onChatMessageDelete,
    chatMessageDeleting,
    onChatMessageUpdate,
    chatMessageUpdating,
  } = useChatMessageActions();
  const { onChatMessageReactionToggle, chatMessageReactionToggling } =
    useChatMessageReactionActions();
  const isPending = chatMessageUpdating || chatMessageDeleting;

  //TODO - need to add an alert model to delete message
  const handleUpdate = ({
    body,
    image,
    templateImage,
  }: {
    body: Delta;
    image: File | null;
    templateImage: string | null;
  }) => {
    onChatMessageUpdate({ id, body: JSON.stringify(body) });
    setEditingId(null);
  };
  const handleReaction = (name: string, value: any) => {
    onChatMessageReactionToggle({ chatMessageId: id, name, value });
  };

  if (isCompact)
    return (
      <div
        className={cn(
          "relative flex flex-col gap-2 p-1.5 px-5 hover:bg-secondary group",
          isEditing && "bg-primary/25 hover:bg-primary/25",
          chatMessageDeleting &&
            "bg-rose-500/50 transform transition-all scale-y-0  origin-bottom duration-200"
        )}
      >
        <div
          className={cn(
            "flex items-start gap-2",
            isAuthor && "flex-row-reverse"
          )}
        >
          <Hint label={formatFullDateTime(createdAt, "")}>
            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
              {formatDate(createdAt, "hh:mm")}
            </button>
          </Hint>

          {isEditing ? (
            <div className="w-full h-full">
              <QuillEditor
                onSubmit={handleUpdate}
                disabled={isPending || !!deletedBy}
                defaultValue={JSON.parse(body as string)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div
              className={cn(
                "flex flex-col border bg-secondary text-foreground  max-w-[70%] text-wrap break-words rounded-md p-1 px-3 w-fit",
                isAuthor && " items-end bg-primary/50"
              )}
            >
              {deletedBy ? (
                <div className="text-sm italic">message deleted</div>
              ) : (
                <>
                  <div className="ql-editor ql-renderer !text-foreground">
                    <Renderer value={body} />
                  </div>

                  <Thumbnail url={image} />
                </>
              )}
              {updatedAt > createdAt && !!!deletedBy && (
                <span className="text-xs text-muted-foreground">
                  (edited) {formatFullDateTime(updatedAt, "")}
                </span>
              )}
              <Reactions reactions={reactions} onChange={handleReaction} />
            </div>
          )}
        </div>
        {!isEditing && !!!deletedBy && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleDelete={() => onChatMessageDelete(id)}
            handleReaction={handleReaction}
          />
        )}
      </div>
    );
  const avatarFallback = userName?.charAt(0).toUpperCase();
  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 p-1.5 px-5 hover:bg-secondary group",
        isEditing && "bg-primary/25 hover:bg-primary/25"
      )}
    >
      <div
        className={cn("flex items-start gap-2", isAuthor && "flex-row-reverse")}
      >
        <button>
          <Avatar className="rounded-full">
            <AvatarImage className="rounded-full" src={userImage!} />
            <AvatarFallback className="rounded-full bg-primary/50 text-xs">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
        {isEditing ? (
          <div className="w-full h-full">
            <QuillEditor
              onSubmit={handleUpdate}
              disabled={isPending}
              defaultValue={JSON.parse(body as string)}
              onCancel={() => setEditingId(null)}
              variant="update"
            />
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col w-full overflow-hidden",
              isAuthor && "items-end"
            )}
          >
            <div
              className={cn(
                "flex items-center text-sm",
                isAuthor && "flex-row-reverse"
              )}
            >
              <button
                onClick={() => {}}
                className="font-bold text-primary hover:underline"
              >
                {userName}
              </button>
              <span>&nbsp;&nbsp;</span>
              <Hint label={formatFullDateTime(createdAt, "")}>
                <button className="text-xs text-muted-foreground hover:underline">
                  {formatDate(createdAt, "h:mm a")}
                </button>
              </Hint>
            </div>

            <div
              className={cn(
                "flex flex-col border bg-secondary text-foreground max-w-[70%] text-wrap break-words rounded-md p-1 px-3 w-fit",
                isAuthor && " items-end bg-primary/50 "
              )}
            >
              {deletedBy ? (
                <div className="text-sm italic">message deleted</div>
              ) : (
                <>
                  <div className="ql-editor ql-renderer !text-foreground">
                    <Renderer value={body} />
                  </div>
                  <Thumbnail url={image} />
                </>
              )}
              {updatedAt > createdAt && !!!deletedBy && (
                <span className="text-xs text-muted-foreground">
                  (edited) {formatFullDateTime(updatedAt, "")}
                </span>
              )}

              <Reactions reactions={reactions} onChange={handleReaction} />
            </div>
          </div>
        )}
      </div>
      {!isEditing && !!!deletedBy && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={isPending}
          handleEdit={() => setEditingId(id)}
          handleDelete={() => onChatMessageDelete(id)}
          handleReaction={handleReaction}
        />
      )}
    </div>
  );
};
