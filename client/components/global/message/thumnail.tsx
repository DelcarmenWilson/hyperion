import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
type Props = {
  url?: string | null | undefined;
};

export const Thumbnail = ({ url }: Props) => {
  if (!url) return null;
  return (
    //TODO - see if we can use the dialog we created
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[160px] border rounded-lg my-2 cursor-zoom-in  hover:border-primary">
          <img
            className="rounded-md object-cover size-full aspect-square transition-transform duration-300 transform hover:scale-125 "
            src={url}
            alt="Message Image"
          />
        </div>
      </DialogTrigger>
      <DialogContent className=" max-w-[600px] aspect-square border-none bg-transparent p-0 shadow-none">
        <img
          className="rounded-md object-cover size-full aspect-square"
          src={url}
          alt="Message Image"
        />
      </DialogContent>
    </Dialog>
  );
};
