import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Lock, Package, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { getOnSaleProducts, getProducts } from "@/lib/products";
import {
  getTopLevelCategoriesWithImages,
  type CategoryNode,
} from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import type { WooProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

export const revalidate = 300;

function SectionHeading({
  title,
  href,
  cta = "Ver todo",
  light = false,
}: {
  title: React.ReactNode;
  href: string;
  cta?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <h2
        className={`text-3xl font-black tracking-tight sm:text-5xl ${light ? "text-white" : "text-brand-ink"}`}
      >
        {title}
      </h2>
      <Link
        href={href}
        className={`group flex shrink-0 items-center gap-2 text-lg font-bold ${light ? "text-white" : "text-brand-ink hover:text-brand-red"}`}
      >
        {cta}
        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function ProductGrid({ products }: { products: WooProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function PackshotTile({
  product,
  className,
}: {
  product?: WooProduct;
  className?: string;
}) {
  if (!product?.images[0]?.src) return null;
  return (
    <Link
      href={`/producto/${product.slug}`}
      className={cn(
        "relative block overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/25 transition-transform duration-300 hover:scale-[1.03]",
        className
      )}
    >
      <Image
        src={product.images[0].src}
        alt={product.name}
        fill
        className="object-contain p-4"
        sizes="(max-width: 768px) 45vw, 22vw"
      />
    </Link>
  );
}

const tileColors = [
  "bg-rose-100",
  "bg-neutral-200",
  "bg-red-100",
  "bg-stone-200",
  "bg-pink-100",
  "bg-zinc-200",
];

function CategoryTile({
  category,
  index,
  large = false,
}: {
  category: CategoryNode;
  index: number;
  large?: boolean;
}) {
  return (
    <Link
      href={`/tienda?categoria=${category.slug}`}
      className={`group relative flex w-full overflow-hidden rounded-3xl ${tileColors[index % tileColors.length]} ${large ? "min-h-[540px] md:row-span-2" : "min-h-[260px]"}`}
    >
      {category.image && (
        <Image
          src={category.image}
          alt=""
          fill
          className="object-contain px-6 pt-4 pb-24 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          sizes={large ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 50vw, 25vw"}
        />
      )}
      <div className="relative mt-auto flex w-full items-end justify-between gap-2 p-5">
        <div>
          <p className={`font-black leading-none tracking-tight text-brand-ink ${large ? "text-4xl sm:text-5xl" : "text-3xl"}`}>
            {category.name}
          </p>
          <p className="mt-1 text-lg font-medium text-neutral-700">
            {category.count.toLocaleString("es-ES")} productos
          </p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-ink text-white transition-colors group-hover:bg-brand-red">
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}

const guides = [
  { slug: "women", title: "Para ella", text: "Succionadores, vibradores y más", color: "bg-brand-red text-white" },
  { slug: "men", title: "Para él", text: "Masturbadores y anillos", color: "bg-brand-ink text-white" },
  { slug: "parejas", title: "En pareja", text: "Para disfrutar juntos", color: "bg-white text-brand-ink" },
  { slug: "juegos", title: "Juegos", text: "Diversión para romper el hielo", color: "bg-rose-200 text-brand-ink" },
];

export default async function HomePage() {
  // Sequential on purpose: the WooCommerce backend struggles with concurrent requests.
  const categories = await getTopLevelCategoriesWithImages(15).catch(() => []);
  const latest = await getProducts({ perPage: 8, orderby: "date", order: "desc" })
    .then((r) => r.products)
    .catch(() => []);
  const latestIds = new Set(latest.map((p) => p.id));
  const popular = await getProducts({ perPage: 24, orderby: "popularity", order: "desc" })
    .then((r) => r.products.filter((p) => !latestIds.has(p.id)).slice(0, 8))
    .catch(() => []);
  let onSale = await getOnSaleProducts(3).catch(() => []);
  if (onSale.length === 0) {
    onSale = await getProducts({ perPage: 3, category: "ofertas" })
      .then((r) => r.products)
      .catch(() => []);
  }

  const heroProducts = latest.filter((p) => p.images[0]?.src);
  const categoryGrid = categories.slice(0, 7);
  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  return (
    <div>
      {/* HERO — rojo a sangre */}
      <section className="relative overflow-hidden bg-brand-red">
        <div className="absolute -right-24 -bottom-24 size-[28rem] rounded-full bg-white/10" />
        <div className="absolute top-10 right-1/3 size-40 rounded-full bg-black/10" />
        <div className="relative mx-auto grid max-w-[1600px] items-center gap-12 px-4 lg:px-8 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <span className="inline-block rounded-full bg-white px-5 py-2 text-sm font-extrabold tracking-wider text-brand-red uppercase">
              Nuevas llegadas
            </span>
            <h1 className="mt-6 text-5xl leading-[0.95] font-black tracking-tight text-white uppercase sm:text-7xl lg:text-8xl">
              El placer
              <br />
              de sentir
            </h1>
            <p className="mt-6 max-w-lg text-xl font-medium text-white">
              Juguetes, lencería y cosmética íntima para todos los gustos.
              Envío 100% discreto.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/tienda"
                className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-extrabold text-brand-red transition-colors hover:bg-brand-ink hover:text-white"
              >
                Comprar ahora
                <ArrowRight className="size-5" />
              </Link>
              <Link
                href="/tienda?categoria=ofertas"
                className="inline-flex h-14 items-center rounded-full border-2 border-white px-8 text-lg font-extrabold text-white transition-colors hover:bg-white hover:text-brand-red"
              >
                Ver ofertas
              </Link>
            </div>
          </div>

          {heroProducts.length >= 3 && (
            <div className="relative mx-auto h-[420px] w-full max-w-lg sm:h-[500px]">
              <PackshotTile
                product={heroProducts[0]}
                className="absolute top-0 left-0 h-[70%] w-[58%] -rotate-3"
              />
              <PackshotTile
                product={heroProducts[1]}
                className="absolute top-6 right-0 h-[45%] w-[40%] rotate-3"
              />
              <PackshotTile
                product={heroProducts[2]}
                className="absolute right-6 bottom-0 h-[45%] w-[48%] -rotate-2"
              />
            </div>
          )}
        </div>
      </section>

      {/* Franja de confianza */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-6 px-4 lg:px-8 py-6 lg:grid-cols-4">
          {[
            { icon: Package, text: "Embalaje 100% discreto" },
            { icon: Truck, text: "Envío rápido" },
            { icon: Lock, text: "Pago seguro" },
            { icon: Heart, text: "Atención cercana" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center justify-center gap-3 text-lg font-bold text-brand-ink">
              <Icon className="size-6 shrink-0 text-brand-red" aria-hidden="true" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* Categorías principales — cuadros con foto */}
      {categories.length > 0 && (
        <section className="bg-white pt-20">
          <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
            <h2 className="mb-10 text-3xl font-black tracking-tight text-brand-ink sm:text-5xl">
              Categorías <span className="text-brand-red">principales</span>
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/tienda?categoria=${category.slug}`}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 ring-2 ring-transparent transition-all group-hover:ring-brand-red">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                    )}
                  </div>
                  <p className="mt-3 text-center text-lg font-extrabold text-brand-ink transition-colors group-hover:text-brand-red">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Novedades — blanco */}
      {latest.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
            <SectionHeading
              title={<>Novedades <span className="text-brand-red">que enganchan</span></>}
              href="/tienda"
            />
            <ProductGrid products={latest.slice(0, 8)} />
          </div>
        </section>
      )}

      {/* Categorías — gris, mosaico */}
      {categoryGrid.length > 0 && (
        <section className="bg-neutral-100 py-20">
          <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
            <SectionHeading title="Explora por categoría" href="/tienda" />
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2">
              {categoryGrid.slice(0, 1).map((c) => (
                <div key={c.id} className="sm:col-span-2 md:row-span-2 md:flex">
                  <CategoryTile category={c} index={0} large />
                </div>
              ))}
              {categoryGrid.slice(1, 5).map((c, i) => (
                <CategoryTile key={c.id} category={c} index={i + 1} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banner ofertas — negro a sangre */}
      <section className="relative overflow-hidden bg-brand-ink py-20 text-white">
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-brand-red/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1600px] items-center gap-12 px-4 lg:px-8 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-brand-red px-5 py-2 text-sm font-extrabold tracking-wider uppercase">
              Ofertas
            </span>
            <h2 className="mt-6 text-5xl leading-[0.95] font-black tracking-tight uppercase sm:text-7xl">
              Ofertas
              <br />
              <span className="text-brand-red">que queman</span>
            </h2>
            <p className="mt-6 max-w-md text-xl text-white/90">
              Caprichos irresistibles a precios que seducen. Por tiempo
              limitado.
            </p>
            <Link
              href="/tienda?categoria=ofertas"
              className="mt-10 inline-flex h-14 items-center gap-2 rounded-full bg-brand-red px-8 text-lg font-extrabold transition-colors hover:bg-white hover:text-brand-red"
            >
              Ver todas las ofertas
              <ArrowRight className="size-5" />
            </Link>
          </div>

          {onSale.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {onSale.map((product) => (
                <Link
                  key={product.id}
                  href={`/producto/${product.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white text-brand-ink"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.images[0]?.src ?? "/placeholder-product.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 1024px) 30vw, 15vw"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-brand-red px-2.5 py-1 text-sm font-extrabold text-white">
                      Oferta
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-base leading-snug font-bold sm:text-lg">{product.name}</p>
                    <p className="mt-1 text-xl font-black text-brand-red">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Más vendidos — blanco */}
      {popular.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
            <SectionHeading title="Los más vendidos" href="/tienda" />
            <ProductGrid products={popular} />
          </div>
        </section>
      )}

      {/* Guías — rosa */}
      <section className="bg-rose-50 py-20">
        <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
          <SectionHeading title="¿Para quién es?" href="/tienda" cta="Todo el catálogo" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {guides.map((guide) => {
              const category = bySlug.get(guide.slug);
              return (
                <Link
                  key={guide.slug}
                  href={`/tienda?categoria=${guide.slug}`}
                  className={`group flex min-h-[320px] flex-col overflow-hidden rounded-3xl shadow-sm transition-transform duration-300 hover:-translate-y-1 ${guide.color}`}
                >
                  <div className="p-6">
                    <p className="text-3xl font-black tracking-tight">{guide.title}</p>
                    <p className="mt-2 text-lg font-medium opacity-90">{guide.text}</p>
                  </div>
                  {category?.image && (
                    <div className="relative mx-4 mt-auto mb-4 aspect-[4/5] overflow-hidden rounded-2xl bg-white">
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 45vw, 22vw"
                      />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
