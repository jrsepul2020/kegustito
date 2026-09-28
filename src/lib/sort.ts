import type { GetProductsParams } from "@/lib/products";

export const SORT_OPTIONS = [
  { value: "novedades", label: "Novedades", orderby: "date", order: "desc" },
  { value: "populares", label: "Más populares", orderby: "popularity", order: "desc" },
  { value: "precio-asc", label: "Precio: menor a mayor", orderby: "price", order: "asc" },
  { value: "precio-desc", label: "Precio: mayor a menor", orderby: "price", order: "desc" },
  { value: "valorados", label: "Mejor valorados", orderby: "rating", order: "desc" },
] as const satisfies readonly {
  value: string;
  label: string;
  orderby: NonNullable<GetProductsParams["orderby"]>;
  order: NonNullable<GetProductsParams["order"]>;
}[];

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function resolveSort(value?: string) {
  return SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];
}
