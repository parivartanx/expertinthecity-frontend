import Footer from "@/components/mainwebsite/Footer";
import Header from "@/components/mainwebsite/Header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
} 