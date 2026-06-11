"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";

export default function ResponsiveShell({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <div className="hidden md:fixed md:inset-y-0 md:flex">{sidebar}</div>

      <div className={`fixed inset-0 z-40 md:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div className={`absolute inset-y-0 left-0 transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute right-3 top-3 z-10 rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
          {sidebar}
        </div>
      </div>

      <div className="flex min-h-screen flex-col md:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:hidden">
          <button
            type="button"
            aria-label="Open sidebar"
            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-base font-bold text-slate-950">RentCar Admin</span>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-12 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
