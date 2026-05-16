import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/seeker/signup")({ component: SeekerSignup });

function SeekerSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ full_name: "", email: "", phone: "", national_id: "", password: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: f.email,
      password: f.password,
      options: {
        emailRedirectTo: `${window.location.origin}/seeker`,
        data: { role: "seeker", full_name: f.full_name, phone: f.phone, national_id: f.national_id },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created. Welcome to Find a Space KE.");
    navigate({ to: "/seeker" });
  };

  return (
    <AuthShell title="Create your Space Seeker account" subtitle="Find your next shop, office, stall or godown across Kenya." side="seeker">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Full name"><Input required value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></Field>
        <Field label="Email"><Input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone"><Input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="07XXXXXXXX" /></Field>
          <Field label="National ID"><Input required value={f.national_id} onChange={(e) => setF({ ...f, national_id: e.target.value })} /></Field>
        </div>
        <Field label="Password"><Input type="password" required minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></Field>
        <Button type="submit" disabled={loading} className="w-full" size="lg">{loading ? "Creating account…" : "Create account"}</Button>
        <p className="text-sm text-muted-foreground text-center">
          Already have an account? <Link to="/seeker/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
