"use client";

import { useId } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/sort";


export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="shrink-0 text-lg font-semibold text-brand-ink">
        Ordenar por
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("orden", e.target.value);
          params.delete("pagina");
          router.push(`${pathname}?${params.toString()}`);
        }}
        className="h-12 cursor-pointer rounded-full border-2 border-neutral-200 bg-white px-4 text-lg font-semibold text-brand-ink outline-none focus-visible:border-brand-red"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
