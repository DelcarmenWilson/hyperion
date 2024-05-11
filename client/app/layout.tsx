import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { cn } from "@/lib/utils";
import "./globals.css";
import "./themes/themes.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";

import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/modal";
import { ThemeProvider } from "@/providers/theme";
import { ThemeSwitcher } from "@/components/custom/theme/switcher";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Hyperion",
  description: "Hyper Eye On",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={cn("bg-secondary", poppins.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider />
            <Toaster richColors />
            {children}
            <ThemeSwitcher />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
