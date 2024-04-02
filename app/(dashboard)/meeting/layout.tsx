import { ReactNode } from "react";

import StreamProvider from "@/providers/stream";

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <StreamProvider>{children}</StreamProvider>
    </main>
  );
};

export default RootLayout;
