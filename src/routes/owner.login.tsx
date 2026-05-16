import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/owner/login")({ component: OwnerLogin });

function OwnerLogin() {
  const navigate = useNavigate();
  const { refreshRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ email: "", password: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(f);
    if (error) { setLoading(false); toast.error(error.message); return; }
    await refreshRole();
    setLoading(false);
    navigate({ to: "/owner" });
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your listings." side="owner">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5"><Label>Email</Label><Input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Password</Label><Input type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
        <Button type="submit" disabled={loading} className="w-full bg-highland text-highland-foreground hover:bg-highland/90" size="lg">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          New owner? <Link to="/owner/signup" className="font-medium text-primary hover:underline">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}
