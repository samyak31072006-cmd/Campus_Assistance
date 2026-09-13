"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Compass, Search, User, Shield, HelpCircle, ArrowRight, Menu, X, CreditCard } from "lucide-react";
import { UserRole } from "./ui/demo-role-banner";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("STUDENT");

  useEffect(() => {
    const match = document.cookie.match(new RegExp("(^| )demo_role=([^;]+)"));
    if (match && (match[2] === "STUDENT" || match[2] === "CREATOR" || match[2] === "ADMIN")) {
      setRole(match[2] as UserRole);
    }
  }, [pathname]);

  const navLinks = [
    { name: "Assignments", href: "/assignments", icon: FileText, badge: "₹25/pg" },
    { name: "CAD Sheets", href: "/cad", icon: Compass, badge: "Samples" },
    { name: "How It Works", href: "/#how-it-works", icon: HelpCircle },
    { name: "Track Order", href: "/#track", icon: Search },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center text-white font-bold shadow-md group-hover:bg-brand-blue transition duration-200">
            <span className="text-xl tracking-wider font-extrabold text-blue-400">C</span>
            <span className="text-xl tracking-wider font-extrabold text-emerald-400">A</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-brand-navy tracking-tight group-hover:text-brand-blue transition">
                CampusAssist
              </span>
              <span className="bg-blue-50 text-brand-blue text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200 uppercase tracking-wide">
                Campus
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
              Assignment & CAD Assistance
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                  isActive
                    ? "bg-slate-100 text-brand-blue font-semibold"
                    : "text-slate-600 hover:text-brand-navy hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-blue" : "text-slate-400"}`} />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="bg-blue-100 text-brand-blue text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons / Role Links */}
        <div className="hidden md:flex items-center gap-3">
          {role === "ADMIN" ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin/payments"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 transition flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                Payments Ledger
              </Link>
              <Link
                href="/admin"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Portal
              </Link>
            </div>
          ) : role === "CREATOR" ? (
            <Link
              href="/creator"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Creator Portal
            </Link>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-slate-700 hover:text-brand-navy px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 hover:bg-slate-50"
              >
                <User className="w-4 h-4 text-slate-500" />
                Dashboard
              </Link>

              <Link
                href="/assignments"
                className="bg-brand-navy hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition flex items-center gap-1.5 group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu hamburger button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 text-base font-medium"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-500" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-blue-100 text-brand-blue text-xs font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              <User className="w-4 h-4" />
              My Orders & Account
            </Link>
            <Link
              href="/assignments"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white font-semibold shadow-md"
            >
              <span>Upload New Assignment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
