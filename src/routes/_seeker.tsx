import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_seeker")({ component: SeekerLayout });

function SeekerLayout() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/seeker/login" }); return; }
    if (role && role !== "seeker") {
      navigate({ to: role === "owner" ? "/owner" : "/admin" });
    }
  }, [user, role, loading, navigate]);

  if (loading || !user || (role && role !== "seeker")) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }
  return <Outlet />;
}
