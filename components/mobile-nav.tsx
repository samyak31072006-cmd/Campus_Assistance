"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, ShoppingBag, User } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/assignments", icon: Layers },
    { name: "Orders", href: "/dashboard", icon: ShoppingBag },
    { name: "Profile", href: "/dashboard?tab=profile", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href.split("?")[0]) && tab.href !== "/";
        const Icon = tab.icon;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
              isActive ? "text-brand-blue font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-brand-blue" : "text-slate-400"}`} />
            <span className="text-[11px] mt-0.5">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
