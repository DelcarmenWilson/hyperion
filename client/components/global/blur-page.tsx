import React from "react";

type Props = {
  children: React.ReactNode;
};

const BlurPage = ({ children }: Props) => {
  return (
    <div
      id="blur-page"
      className="flex flex-col h-screen  overflow-hidden backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black  mx-auto pt-14 px-4 absolute top-0 right-0 left-0 botton-0 z-[11]"
    >
      {children}
    </div>
  );
};

export default BlurPage;
