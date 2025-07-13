import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ExpertsProvider } from "@/lib/contexts/experts-context";
import { UsersProvider } from "@/lib/contexts/users-context";
import PresenceProvider from "@/components/PresenceProvider";
import GlobalChatNotifier from "@/components/mainwebsite/GlobalChatNotifier";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExpertInTheCity - Connect with Experts",
  description: "Connect with verified experts in various fields for one-on-one consultations and guidance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Global chat notifier for new message notifications */}
        <GlobalChatNotifier />
        <PresenceProvider>
          <ExpertsProvider>
            <UsersProvider>
              {children}
            </UsersProvider>
          </ExpertsProvider>
        </PresenceProvider>
        <Toaster />
      </body>
    </html>
  );
}
