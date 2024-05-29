"use client";

import { ThemeProvider } from "@/providers/theme";
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ModalProvider } from "@/providers/modal";
import { ThemeSwitcher } from "@/components/custom/theme/switcher";
import SocketContextComponent from "@/providers/socket-component";

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
        <ModalProvider />
        <SocketContextComponent>{children}</SocketContextComponent>
        <ThemeSwitcher />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default RootProviders;
