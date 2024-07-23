"use client";

import { ThemeProvider } from "@/providers/theme";
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MasterModalProvider } from "@/providers/master-modal";
import { ThemeSwitcher } from "@/components/custom/theme/switcher";
import { ImageViewerModal } from "@/components/modals/image-viewer-modal";
import ModalProvider from "./modal";

const queryClient = new QueryClient({});
const RootProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <ModalProvider>{children}</ModalProvider>

        <MasterModalProvider />
        <ThemeSwitcher />
        <ImageViewerModal />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default RootProviders;
