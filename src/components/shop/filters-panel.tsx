"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export function FiltersPanel({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mb-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-ink text-lg font-bold text-white lg:hidden"
      >
        {open ? <X className="size-5" /> : <SlidersHorizontal className="size-5" />}
        {open ? "Cerrar filtros" : "Categorías y filtros"}
      </button>
      <div className={open ? "block" : "hidden lg:block"}>{children}</div>
    </>
  );
}
