import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicNav } from "@/components/site/PublicNav";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/support")({ component: Support });

function Support() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("support_messages").insert(f);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Message received. We will get back to you.");
    setF({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <PublicNav />
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-display text-4xl font-bold">Support</h1>
        <p className="mt-3 text-muted-foreground">
          Find a Space KE is built for Kenya. Whether you are looking for a space or have one to list,
          we are here to help. Send us a message and our team will respond.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div><Label>Name</Label><Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div><Label>Email</Label><Input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div><Label>Message</Label><Textarea required rows={6} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Sending…" : "Send message"}</Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
