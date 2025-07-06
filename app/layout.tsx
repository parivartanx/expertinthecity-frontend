import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ExpertsProvider } from "@/lib/contexts/experts-context";
import { UsersProvider } from "@/lib/contexts/users-context";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expert in the City",
  description: "Connect with experts in your city",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ExpertsProvider>
          <UsersProvider>
            {children}
            <Toaster position="top-right" />
          </UsersProvider>
        </ExpertsProvider>
      </body>
    </html>
  );
}
