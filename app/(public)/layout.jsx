"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  const isCheckout = pathname === "/checkout";

  return (
    <>
      {!isCheckout && <Header />}
      {children}
      {!isCheckout && <Footer />}
    </>
  );
}
