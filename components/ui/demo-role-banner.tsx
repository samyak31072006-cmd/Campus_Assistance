"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Shield, Sparkles, Code, Check } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export type UserRole = "STUDENT" | "CREATOR" | "ADMIN";

export function DemoRoleBanner() {
  const [currentRole, setCurrentRole] = useState<UserRole>("STUDENT");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const match = document.cookie.match(new RegExp("(^| )demo_role=([^;]+)"));
    if (match && (match[2] === "STUDENT" || match[2] === "CREATOR" || match[2] === "ADMIN")) {
      setCurrentRole(match[2] as UserRole);
    }
  }, []);

  const switchRole = (role: UserRole) => {
    document.cookie = `demo_role=${role}; path=/; max-age=86400`;
    setCurrentRole(role);
    
    // Redirect to default route for role if applicable
    if (role === "ADMIN" && !pathname.startsWith("/admin")) {
      router.push("/admin");
    } else if (role === "CREATOR" && !pathname.startsWith("/creator")) {
      router.push("/creator");
    } else if (role === "STUDENT" && (pathname.startsWith("/admin") || pathname.startsWith("/creator"))) {
      router.push("/dashboard");
    } else {
      router.refresh();
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-brand-navy text-white px-4 py-2 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-sm z-50 relative">
      <div className="flex items-center gap-2 font-medium">
        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border border-emerald-500/30">
          <Sparkles className="w-3 h-3" />
          DEVELOPMENT DEMO MODE
        </span>
        <span className="hidden sm:inline text-slate-400">
          Instant multi-role testing toggle:
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => switchRole("STUDENT")}
          className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
            currentRole === "STUDENT"
              ? "bg-brand-blue text-white shadow-sm"
              : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Student View
          {currentRole === "STUDENT" && <Check className="w-3 h-3 ml-0.5" />}
        </button>

        <button
          onClick={() => switchRole("CREATOR")}
          className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
            currentRole === "CREATOR"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Creator View
          {currentRole === "CREATOR" && <Check className="w-3 h-3 ml-0.5" />}
        </button>

        <button
          onClick={() => switchRole("ADMIN")}
          className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
            currentRole === "ADMIN"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Admin SaaS View
          {currentRole === "ADMIN" && <Check className="w-3 h-3 ml-0.5" />}
        </button>
      </div>
    </div>
  );
}
