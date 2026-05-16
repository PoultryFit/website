import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_admin")({ component: AdminLayout });

function AdminLayout() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/seeker/login" }); return; }
    if (role && role !== "admin") {
      navigate({ to: role === "owner" ? "/owner" : "/seeker" });
    }
  }, [user, role, loading, navigate]);

  if (loading || !user || role !== "admin") {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }
  return <Outlet />;
}
