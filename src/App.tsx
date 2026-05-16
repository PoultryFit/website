import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";

import Landing from "@/pages/Landing";
import Feedback from "@/pages/Feedback";
import Support from "@/pages/Support";
import SeekerSignup from "@/pages/SeekerSignup";
import SeekerLogin from "@/pages/SeekerLogin";
import OwnerSignup from "@/pages/OwnerSignup";
import OwnerLogin from "@/pages/OwnerLogin";
import SeekerDashboard from "@/pages/SeekerDashboard";
import Browse from "@/pages/Browse";
import Saved from "@/pages/Saved";
import SpaceDetail from "@/pages/SpaceDetail";
import OwnerDashboard from "@/pages/OwnerDashboard";
import Publish from "@/pages/Publish";
import Admin from "@/pages/Admin";

function RoleGuard({
  role: required,
  loginPath,
  children,
}: {
  role: "seeker" | "owner" | "admin";
  loginPath: string;
  children: ReactNode;
}) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!user) return <Navigate to={loginPath} replace state={{ from: location }} />;
  if (role && role !== required) {
    const target = role === "admin" ? "/admin" : role === "owner" ? "/owner" : "/seeker";
    return <Navigate to={target} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/support" element={<Support />} />

      <Route path="/seeker/signup" element={<SeekerSignup />} />
      <Route path="/seeker/login" element={<SeekerLogin />} />
      <Route path="/owner/signup" element={<OwnerSignup />} />
      <Route path="/owner/login" element={<OwnerLogin />} />

      <Route path="/seeker" element={<RoleGuard role="seeker" loginPath="/seeker/login"><SeekerDashboard /></RoleGuard>} />
      <Route path="/seeker/browse" element={<RoleGuard role="seeker" loginPath="/seeker/login"><Browse /></RoleGuard>} />
      <Route path="/seeker/saved" element={<RoleGuard role="seeker" loginPath="/seeker/login"><Saved /></RoleGuard>} />
      <Route path="/seeker/spaces/:id" element={<RoleGuard role="seeker" loginPath="/seeker/login"><SpaceDetail /></RoleGuard>} />

      <Route path="/owner" element={<RoleGuard role="owner" loginPath="/owner/login"><OwnerDashboard /></RoleGuard>} />
      <Route path="/owner/publish" element={<RoleGuard role="owner" loginPath="/owner/login"><Publish /></RoleGuard>} />

      <Route path="/admin" element={<RoleGuard role="admin" loginPath="/seeker/login"><Admin /></RoleGuard>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          Go home
        </Link>
      </div>
    </div>
  );
}
