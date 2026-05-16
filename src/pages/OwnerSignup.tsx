import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/site/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function OwnerSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ full_name: "", email: "", phone: "", national_id: "", business_description: "", password: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: f.email,
      password: f.password,
      options: {
        emailRedirectTo: `${window.location.origin}/owner`,
        data: { role: "owner", ...f, password: undefined },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Owner account created. Karibu.");
    navigate("/owner");
  };

  return (
    <AuthShell title="Create your Space Owner account" subtitle="Publish your space and get discovered across Kenya." side="owner">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5"><Label>Full name</Label><Input required value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Email</Label><Input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Phone</Label><Input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="07XXXXXXXX" /></div>
          <div className="space-y-1.5"><Label>National ID</Label><Input required value={f.national_id} onChange={(e) => setF({ ...f, national_id: e.target.value })} /></div>
        </div>
        <div className="space-y-1.5"><Label>Business description</Label><Textarea required rows={3} value={f.business_description} onChange={(e) => setF({ ...f, business_description: e.target.value })} placeholder="Tell us briefly about your business or the kind of spaces you manage." /></div>
        <div className="space-y-1.5"><Label>Password</Label><Input type="password" required minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
        <Button type="submit" disabled={loading} className="w-full bg-highland text-highland-foreground hover:bg-highland/90" size="lg">
          {loading ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Already have an account? <Link to="/owner/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}