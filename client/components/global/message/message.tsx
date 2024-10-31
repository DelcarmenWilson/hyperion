import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useChatMessageActions } from "@/hooks/use-chat";

import Hint from "@/components/custom/hint";
import { Thumbnail } from "./thumnail";

import { formatDate, formatFullDateTime } from "@/formulas/dates";
import { Toolbar } from "./toolbar";
import { Delta } from "quill/core";
const Renderer = dynamic(() => import("./renderer"), { ssr: false });
const QuillEditor = dynamic(() => import("@/components/custom/quill-editor"), {
  ssr: false,
});

type Props = {
  id: string;
  userId: string;
  userImage?: string | null;
  userName?: string | null;
  isAuthor: boolean;
  body?: string | null;
  image?: string | null;
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
                "flex flex-col border bg-secondary text-white  max-w-[70%] text-wrap break-words rounded-md p-1 px-3 w-fit",
                isAuthor && " items-end bg-primary/50 text-foreground"
              )}
            >
              {deletedBy ? (
                <div className="text-sm italic">This message was deleted</div>
              ) : (
                <>
                  <Renderer value={body} />
                  <Thumbnail url={image} />
                </>
              )}
              {updatedAt > createdAt && !!!deletedBy && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>
          )}
        </div>
        {!isEditing && !!!deletedBy && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleDelete={() => onChatMessageDelete(id)}
            handleReaction={() => {}}
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
          <Avatar className="rounded-md">
            <AvatarImage className="rounded-md" src={userImage!} />
            <AvatarFallback className="rounded-md bg-primary/50 text-xs">
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
                "flex flex-col border bg-secondary text-white max-w-[70%] text-wrap break-words rounded-md p-1 px-3 w-fit",
                isAuthor && " items-end bg-primary/50 text-foreground"
              )}
            >
              {deletedBy ? (
                <div className="text-sm italic">This message was deleted</div>
              ) : (
                <>
                  <Renderer value={body} />
                  <Thumbnail url={image} />
                </>
              )}
              {updatedAt > createdAt && !!!deletedBy && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
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
          handleReaction={() => {}}
        />
      )}
    </div>
  );
};
