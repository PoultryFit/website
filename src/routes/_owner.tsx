import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_owner")({ component: OwnerLayout });

function OwnerLayout() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/owner/login" }); return; }
    if (role && role !== "owner") {
      navigate({ to: role === "seeker" ? "/seeker" : "/admin" });
    }
  }, [user, role, loading, navigate]);

  if (loading || !user || (role && role !== "owner")) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }
  return <Outlet />;
}
