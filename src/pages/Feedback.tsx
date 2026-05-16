import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PublicNav } from "@/components/site/PublicNav";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Feedback() {
  const { user, role } = useAuth();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in to send feedback"); return; }
    setLoading(true);
    const { error } = await supabase.from("feedback").insert({
      user_id: user.id, user_role: role ?? "seeker", message, rating,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Asante for your feedback");
    setMessage(""); setName("");
  };

  return (
    <div className="min-h-screen">
      <PublicNav />
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-display text-4xl font-bold">Send us feedback</h1>
        <p className="mt-2 text-muted-foreground">We read every message. Tell us what is working and what we should improve.</p>
        {!user && <p className="mt-4 rounded-lg bg-secondary p-4 text-sm">Please <Link to="/seeker/login" className="text-primary underline">sign in</Link> first.</p>}
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div><Label>Your name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Rating</Label>
            <div className="flex gap-2 mt-1">
              {[1,2,3,4,5].map((n) => (
                <button type="button" key={n} onClick={() => setRating(n)} className={`h-10 w-10 rounded-md border ${rating >= n ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>★</button>
              ))}
            </div>
          </div>
          <div><Label>Message</Label><Textarea rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required /></div>
          <Button type="submit" disabled={loading || !user} className="w-full">{loading ? "Sending…" : "Send feedback"}</Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}