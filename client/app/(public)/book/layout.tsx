import React from "react";
type Props = {
  children: React.ReactNode;
};
const BookingPageLayout = ({ children }: Props) => {
  return (
    <div className="flex items-center flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-hidden">{children}</div>
      <div className="text-[12px] realtive bottom-2 right-2 border-slate-400 rounded-md text-slate-400 p-2 leading-3 bg-primary/25  w-full lg:absolute lg:bg-transparent lg:w-fit">
        <p>Powered By </p>
        <p className="font-bold">Strongside Financial </p>
      </div>
    </div>
  );
};

export default BookingPageLayout;
