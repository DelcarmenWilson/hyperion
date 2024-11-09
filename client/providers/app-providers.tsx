"use client";
import React, { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MasterModalProvider } from "@/providers/master-modal";
import { ThemeSwitcher } from "@/components/custom/theme/switcher";
import { ImageViewerModal } from "@/components/modals/image-viewer-modal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disables automatic retries
      retryOnMount: false,
      staleTime: 10000, // Time in milliseconds a query is considered fresh
      // Cache time for inactive queries
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      networkMode: "always",
      structuralSharing: true,
      behavior: undefined,
    },
  },
});
const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <MasterModalProvider />
        <ThemeSwitcher />
        <ImageViewerModal />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProviders;
