import { Suspense } from "react";
import Link from "next/link";
import { ShopSkeleton } from "@/components/shop/shop-skeleton";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { FiltersPanel } from "@/components/shop/filters-panel";
import { SortSelect } from "@/components/shop/sort-select";
import { getProducts } from "@/lib/products";
import {
  getCategoryBySlug,
  getChildCategories,
  getTopLevelCategories,
  type CategoryNode,
} from "@/lib/categories";
import { resolveSort } from "@/lib/sort";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const PER_PAGE = 12;

type SearchParams = {
  categoria?: string;
  q?: string;
  pagina?: string;
  orden?: string;
  min?: string;
  max?: string;
  oferta?: string;
  stock?: string;
};

function toNumber(value?: string) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function buildHref(current: SearchParams, overrides: Partial<SearchParams>) {
  const params = new URLSearchParams();
  const merged = { ...current, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/tienda?${query}` : "/tienda";
}

function getPageWindow(current: number, total: number): (number | "...")[] {
  const delta = 2;
  const range: (number | "...")[] = [1];
  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);
  if (start > 2) range.push("...");
  for (let p = start; p <= end; p++) range.push(p);
  if (end < total - 1) range.push("...");
  if (total > 1) range.push(total);
  return range;
}

async function getSidebarCategories(category: CategoryNode | null) {
  if (!category) {
    return { title: "Categorías", items: await getTopLevelCategories(15) };
  }
  const children = await getChildCategories(category.id, 20);
  if (children.length > 0) {
    return { title: "Subcategorías", items: children };
  }
  if (category.parent) {
    const siblings = await getChildCategories(category.parent, 20);
    return { title: "Relacionadas", items: siblings };
  }
  return { title: "Categorías", items: await getTopLevelCategories(15) };
}

function SidebarBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-neutral-200 pb-7">
      <h2 className="text-xl font-black text-brand-ink">{title}</h2>
      <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-brand-red to-transparent" />
      <div className="mt-5">{children}</div>
    </div>
  );
}

interface TiendaPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function TiendaPage({ searchParams }: TiendaPageProps) {
  const params = await searchParams;
  // Keyed so the skeleton shows immediately on every category/filter/page change.
  return (
    <Suspense key={JSON.stringify(params)} fallback={<ShopSkeleton />}>
      <ShopContent params={params} />
    </Suspense>
  );
}

async function ShopContent({ params }: { params: SearchParams }) {
  const { categoria, q } = params;
  const page = Math.max(1, parseInt(params.pagina ?? "1", 10) || 1);
  const sort = resolveSort(params.orden);
  const minPrice = toNumber(params.min);
  const maxPrice = toNumber(params.max);
  const onSale = params.oferta === "1";
  const inStock = params.stock === "1";

  const category = categoria ? await getCategoryBySlug(categoria).catch(() => null) : null;

  const [{ products, totalPages, total }, sidebar] = await Promise.all([
    getProducts({
      page,
      perPage: PER_PAGE,
      category: categoria,
      search: q,
      orderby: sort.orderby,
      order: sort.order,
      minPrice,
      maxPrice,
      onSale,
      inStock,
    }).catch(() => ({ products: [], totalPages: 0, total: 0 })),
    getSidebarCategories(category).catch(() => ({
      title: "Categorías",
      items: [] as CategoryNode[],
    })),
  ]);

  const title = q ? `Resultados para “${q}”` : category?.name ?? "Tienda";
  const from = total === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);
  const hasFilters = minPrice !== undefined || maxPrice !== undefined || onSale || inStock;

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 lg:px-8">
      <nav aria-label="Migas de pan" className="mb-4 flex items-center gap-2 text-lg text-neutral-600">
        <Link href="/" className="hover:text-brand-red">Inicio</Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <Link href="/tienda" className="hover:text-brand-red">Tienda</Link>
        {category && (
          <>
            <ChevronRight className="size-4" aria-hidden="true" />
            <span className="font-semibold text-brand-ink">{category.name}</span>
          </>
        )}
      </nav>

      <h1 className="text-4xl font-black tracking-tight text-brand-ink sm:text-5xl">{title}</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[300px_1fr]">
        {/* Barra lateral */}
        <aside>
          <FiltersPanel>
            <div className="space-y-7 lg:sticky lg:top-44">
              <SidebarBlock title={sidebar.title}>
                {category && (
                  <Link
                    href={buildHref(params, { categoria: undefined, pagina: undefined })}
                    className="mb-3 flex items-center gap-2 text-lg font-bold text-brand-red hover:underline"
                  >
                    <ArrowLeft className="size-5" aria-hidden="true" />
                    Todas las categorías
                  </Link>
                )}
                <ul className="space-y-1">
                  {sidebar.items.map((item) => {
                    const active = item.slug === categoria;
                    return (
                      <li key={item.id}>
                        <Link
                          href={buildHref(params, { categoria: item.slug, pagina: undefined })}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-lg transition-colors",
                            active
                              ? "bg-brand-red font-bold text-white"
                              : "text-brand-ink hover:bg-brand-red-soft hover:text-brand-red"
                          )}
                        >
                          <span>{item.name}</span>
                          <span className={cn("text-base font-semibold", active ? "text-white" : "text-neutral-500")}>
                            {item.count}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </SidebarBlock>

              <SidebarBlock title="Filtrar">
                <form action="/tienda" method="get" className="space-y-6">
                  {categoria && <input type="hidden" name="categoria" value={categoria} />}
                  {q && <input type="hidden" name="q" value={q} />}
                  {params.orden && <input type="hidden" name="orden" value={params.orden} />}

                  <fieldset>
                    <legend className="text-lg font-bold text-brand-ink">Precio (€)</legend>
                    <div className="mt-3 flex items-center gap-2">
                      <label className="sr-only" htmlFor="min">Precio mínimo</label>
                      <input
                        id="min"
                        name="min"
                        type="number"
                        min={0}
                        inputMode="numeric"
                        placeholder="Mín"
                        defaultValue={params.min}
                        className="h-12 w-full rounded-lg border-2 border-neutral-200 px-3 text-lg outline-none focus-visible:border-brand-red"
                      />
                      <span className="text-lg text-neutral-500">–</span>
                      <label className="sr-only" htmlFor="max">Precio máximo</label>
                      <input
                        id="max"
                        name="max"
                        type="number"
                        min={0}
                        inputMode="numeric"
                        placeholder="Máx"
                        defaultValue={params.max}
                        className="h-12 w-full rounded-lg border-2 border-neutral-200 px-3 text-lg outline-none focus-visible:border-brand-red"
                      />
                    </div>
                  </fieldset>

                  <fieldset className="space-y-3">
                    <legend className="text-lg font-bold text-brand-ink">Disponibilidad</legend>
                    <label className="flex cursor-pointer items-center gap-3 text-lg">
                      <input type="checkbox" name="stock" value="1" defaultChecked={inStock} className="size-5 accent-brand-red" />
                      Solo en stock
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 text-lg">
                      <input type="checkbox" name="oferta" value="1" defaultChecked={onSale} className="size-5 accent-brand-red" />
                      Solo en oferta
                    </label>
                  </fieldset>

                  <button
                    type="submit"
                    className="h-12 w-full rounded-full bg-brand-red text-lg font-bold text-white transition-colors hover:bg-brand-red-dark"
                  >
                    Aplicar filtros
                  </button>
                  {hasFilters && (
                    <Link
                      href={buildHref(
                        { categoria, q, orden: params.orden },
                        {}
                      )}
                      className="block text-center text-lg font-semibold text-brand-ink underline hover:text-brand-red"
                    >
                      Quitar filtros
                    </Link>
                  )}
                </form>
              </SidebarBlock>
            </div>
          </FiltersPanel>
        </aside>

        {/* Resultados */}
        <section aria-label="Productos">
          <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg text-brand-ink" aria-live="polite">
              {total > 0 ? (
                <>
                  Mostrando <strong>{from}–{to}</strong> de{" "}
                  <strong>{total.toLocaleString("es-ES")}</strong> resultados
                </>
              ) : (
                "Sin resultados"
              )}
            </p>
            <SortSelect value={sort.value} />
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-neutral-200 p-12 text-center">
              <p className="text-2xl font-bold text-brand-ink">No hemos encontrado productos</p>
              <p className="mt-2 text-lg text-neutral-600">Prueba con otra categoría o quita algún filtro.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Paginación" className="mt-16 flex flex-wrap items-center justify-center gap-2">
              {page > 1 && (
                <Link
                  href={buildHref(params, { pagina: String(page - 1) })}
                  className="flex h-12 items-center gap-1 rounded-full border-2 border-neutral-200 px-4 text-lg font-bold text-brand-ink hover:border-brand-red hover:text-brand-red"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                  Anterior
                </Link>
              )}
              {getPageWindow(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`gap-${i}`} className="px-2 text-lg text-neutral-500">…</span>
                ) : (
                  <Link
                    key={p}
                    href={buildHref(params, { pagina: p === 1 ? undefined : String(p) })}
                    aria-current={p === page ? "page" : undefined}
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full text-lg font-bold transition-colors",
                      p === page
                        ? "bg-brand-red text-white"
                        : "border-2 border-neutral-200 text-brand-ink hover:border-brand-red hover:text-brand-red"
                    )}
                  >
                    {p}
                  </Link>
                )
              )}
              {page < totalPages && (
                <Link
                  href={buildHref(params, { pagina: String(page + 1) })}
                  className="flex h-12 items-center gap-1 rounded-full border-2 border-neutral-200 px-4 text-lg font-bold text-brand-ink hover:border-brand-red hover:text-brand-red"
                >
                  Siguiente
                  <ChevronRight className="size-5" aria-hidden="true" />
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
