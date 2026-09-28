"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchForm({ className }: { className?: string }) {
  const router = useRouter();
  const inputId = useId();

  return (
    <form
      role="search"
      className={cn(
        "flex h-12 items-center rounded-full border border-transparent bg-muted pr-1 pl-5 transition-colors focus-within:border-brand-red focus-within:bg-white",
        className
      )}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get("q")?.toString().trim();
        if (query) {
          router.push(`/tienda?q=${encodeURIComponent(query)}`);
        }
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Buscar productos
      </label>
      <input
        id={inputId}
        name="q"
        type="search"
        placeholder="Buscar productos..."
        className="h-full flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="flex size-10 items-center justify-center rounded-full bg-brand-red text-white transition-colors hover:bg-brand-red-dark"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
}
