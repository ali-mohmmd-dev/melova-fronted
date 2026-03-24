"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const isAllowed = user?.is_staff || user?.is_superuser;
    if (!loading && (!user || !isAllowed)) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const isAllowed = user?.is_staff || user?.is_superuser;
  if (!user || !isAllowed) {
    return null;
  }

  return <>{children}</>;
}
