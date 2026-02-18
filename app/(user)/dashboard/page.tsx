"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { LawyerDashboard } from "./components/lawyer-dashboard";
import { RegularDashboard } from "./components/regular-dashboard";

export default function DashboardPage() {
  const { isLawyer } = useAuth();

  return (
    <div className="min-h-screen bg-background px-6 py-10 sm:px-12">
      <div className="mx-auto max-w-5xl">
        {isLawyer ? <LawyerDashboard /> : <RegularDashboard />}
      </div>
    </div>
  );
}
