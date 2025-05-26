import type { Metadata } from "next";
import "../../globals.css";
import Footer from "@/components/mainwebsite/Footer";
import Header from "@/components/mainwebsite/Header";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expert in the City",
  description: "Connect with experts in your city",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
