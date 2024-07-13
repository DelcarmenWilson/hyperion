import React from "react";
type MessageCardProps = { username: string; content: string; createdAt: Date };

export const MessageCard = ({
  username,
  content,
  createdAt,
}: MessageCardProps) => {
  return (
    <div className="border bg-primary text-white">
      {/* {JSON.stringify(message)} */}

      {content}
      {/* {message.createdAt.toString()}
  {message.sender.userName} */}
    </div>
  );
};
