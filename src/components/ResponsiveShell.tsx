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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="hidden md:fixed md:inset-y-0 md:flex">{sidebar}</div>

      <div className={`fixed inset-0 z-40 md:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-slate-900/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div className={`absolute inset-y-0 left-0 transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute right-3 top-3 z-10 rounded-md bg-white p-2 shadow dark:bg-slate-900"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
          {sidebar}
        </div>
      </div>

      <div className="flex min-h-screen flex-col md:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-white px-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <button type="button" aria-label="Open sidebar" className="rounded-md p-2" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold">Rent Car App</span>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
