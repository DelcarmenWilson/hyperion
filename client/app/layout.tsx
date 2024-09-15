import type { Metadata, Viewport } from "next";
// import { Lobster_Two } from "next/font/google";
import { Roboto } from "next/font/google";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import "./themes/themes.css";

import { Toaster } from "@/components/ui/sonner";
import RootProviders from "@/providers/root-providers";

const poppins = Roboto({
  subsets: ["latin"],
  // weight: ["400", "700"], --Lobster_Two

  weight: ["100", "300", "400", "500", "700", "900"],
  //  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
      <html lang="en" suppressHydrationWarning>
        <body className={poppins.className}>
          <Toaster richColors position="bottom-right" />
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
    </SessionProvider>
  );
}
