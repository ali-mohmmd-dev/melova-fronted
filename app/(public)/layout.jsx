"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname === "/checkout" || pathname === "/cart";

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
