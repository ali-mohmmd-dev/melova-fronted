import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }) {
  return (
    <AuthGuard>
      <Header />
      {children}
      <Footer />
    </AuthGuard>
  );
}
