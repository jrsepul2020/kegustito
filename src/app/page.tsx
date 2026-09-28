import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Heart, Lock, Package, Sparkles, Truck } from "lucide-react";
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

const tileStyles = [
  { bg: "bg-gradient-to-br from-[#e0213a] via-brand-red to-[#6d0712]", badge: "Top ventas" },
  { bg: "bg-gradient-to-br from-[#2a2a2a] via-brand-ink to-[#5c0a14]", badge: "Imprescindibles" },
  { bg: "bg-gradient-to-br from-pink-500 via-rose-500 to-brand-red", badge: "Novedades" },
  { bg: "bg-gradient-to-br from-orange-500 via-[#e8402a] to-brand-red", badge: "Más buscados" },
  { bg: "bg-gradient-to-br from-fuchsia-600 via-pink-600 to-[#8a0c1a]", badge: "Favoritos" },
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
  const style = tileStyles[index % tileStyles.length];

  const image = category.image && (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/30 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105",
        large ? "mx-auto mt-8 aspect-square w-[58%] rotate-3" : "aspect-square w-[42%] max-w-32 rotate-6"
      )}
    >
      <Image
        src={category.image}
        alt=""
        fill
        className="object-contain p-2"
        sizes={large ? "(max-width: 768px) 55vw, 22vw" : "128px"}
      />
    </div>
  );

  const badge = (
    <span className="inline-block rounded-full bg-white px-3 py-1 text-sm font-extrabold tracking-wide whitespace-nowrap text-brand-red uppercase">
      {style.badge}
    </span>
  );

  return (
    <Link
      href={`/tienda?categoria=${category.slug}`}
      lang="es"
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-3xl border-4 border-white text-white shadow-[0_12px_32px_rgba(197,19,36,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(197,19,36,0.4)]",
        style.bg,
        large ? "min-h-[560px] md:row-span-2" : "min-h-[290px] p-5"
      )}
    >
      <div className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute top-1/3 -left-10 size-32 rounded-full bg-black/10" />

      {large ? (
        image
      ) : (
        <div className="relative flex items-start justify-between gap-3">
          {badge}
          {image}
        </div>
      )}

      <div className={cn("relative mt-auto min-w-0", large && "p-6")}>
        {large && badge}
        <p
          className={cn(
            "leading-none font-black tracking-tight hyphens-auto drop-shadow-sm",
            large ? "mt-3 text-5xl sm:text-6xl" : "mt-4 text-2xl xl:text-3xl"
          )}
        >
          {category.name}
        </p>
        <p className="mt-2 text-lg font-semibold text-white/90">
          +{category.count.toLocaleString("es-ES")} productos
        </p>
        <span className="mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-lg font-extrabold whitespace-nowrap text-brand-ink transition-colors group-hover:bg-brand-ink group-hover:text-white">
          Comprar ahora
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

const guides = [
  {
    slug: "women",
    title: "Para ella",
    text: "Succionadores, vibradores y juguetes que conocen el camino.",
    badge: "Lo más deseado",
    border: "border-brand-red",
    overlay: "from-brand-red via-brand-red/70",
    shadow: "shadow-[0_14px_36px_rgba(197,19,36,0.35)]",
  },
  {
    slug: "men",
    title: "Para él",
    text: "Masturbadores, anillos y todo para subir la intensidad.",
    badge: "Top ventas",
    border: "border-brand-ink",
    overlay: "from-brand-ink via-brand-ink/70",
    shadow: "shadow-[0_14px_36px_rgba(0,0,0,0.35)]",
  },
  {
    slug: "parejas",
    title: "En pareja",
    text: "Juguetes pensados para disfrutar a dos, sin tabúes.",
    badge: "Para compartir",
    border: "border-pink-500",
    overlay: "from-pink-600 via-pink-600/70",
    shadow: "shadow-[0_14px_36px_rgba(219,39,119,0.35)]",
  },
  {
    slug: "juegos",
    title: "Juegos",
    text: "Cartas, dados y retos para romper el hielo.",
    badge: "Diversión",
    border: "border-orange-500",
    overlay: "from-orange-600 via-orange-600/70",
    shadow: "shadow-[0_14px_36px_rgba(234,88,12,0.35)]",
  },
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
            <div className="mb-10 text-center">
              <h2 className="inline-block rounded-2xl bg-brand-red px-8 py-4 text-3xl font-black tracking-tight text-white shadow-[0_10px_28px_rgba(197,19,36,0.35)] sm:text-5xl">
                Categorías principales
              </h2>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-5 lg:gap-5">
              {categories.slice(0, 10).map((category) => (
                <Link
                  key={category.id}
                  href={`/tienda?categoria=${category.slug}`}
                  className="group flex flex-col rounded-2xl border-2 border-brand-red bg-white p-2 shadow-[0_4px_16px_rgba(197,19,36,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(197,19,36,0.22)]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 45vw, 220px"
                      />
                    )}
                  </div>
                  <p className="px-1 pt-2 pb-1 text-center text-lg leading-tight font-extrabold text-brand-ink transition-colors group-hover:text-brand-red">
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

      {/* Banner ofertas — degradado de llama */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0a0a0a_0%,#3b0508_22%,#b3121f_45%,#e8401c_65%,#f97316_80%,#facc15_100%)] py-24 text-white">
        {/* Brillos de fuego */}
        <div className="pointer-events-none absolute -right-20 -bottom-32 size-[34rem] rounded-full bg-yellow-300/40 blur-3xl motion-safe:animate-pulse" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 size-80 rounded-full bg-orange-500/50 blur-3xl" />
        <div className="pointer-events-none absolute -top-24 left-1/4 size-72 rounded-full bg-red-600/30 blur-3xl" />
        <Flame
          className="pointer-events-none absolute -bottom-10 left-[38%] hidden size-72 text-orange-400/25 lg:block"
          strokeWidth={1}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-[1600px] items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-5 py-2 text-sm font-extrabold tracking-wider text-brand-ink uppercase shadow-lg shadow-orange-500/30">
              <Flame className="size-4" aria-hidden="true" />
              Ofertas calientes
            </span>
            <h2 className="mt-6 text-5xl leading-[0.95] font-black tracking-tight uppercase sm:text-7xl lg:text-8xl">
              Ofertas
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                que queman
              </span>
            </h2>
            <p className="mt-6 max-w-md text-xl font-medium text-white">
              Caprichos irresistibles a precios que seducen. Por tiempo
              limitado.
            </p>
            <Link
              href="/tienda?categoria=ofertas"
              className="mt-10 inline-flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 px-8 text-lg font-extrabold text-white shadow-xl shadow-orange-600/40 transition-transform hover:scale-105"
            >
              Ver todas las ofertas
              <ArrowRight className="size-5" />
            </Link>
          </div>

          {onSale.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {onSale.map((product, i) => (
                <Link
                  key={product.id}
                  href={`/producto/${product.slug}`}
                  className={cn(
                    "group overflow-hidden rounded-2xl border-2 border-white/80 bg-white text-brand-ink shadow-2xl shadow-black/30 transition-transform duration-300 hover:-translate-y-1",
                    i === 1 && "lg:-translate-y-6 lg:hover:-translate-y-8"
                  )}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.images[0]?.src ?? "/placeholder-product.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 1024px) 30vw, 15vw"
                    />
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-2.5 py-1 text-sm font-extrabold text-white">
                      <Flame className="size-3.5" aria-hidden="true" />
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
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 text-sm font-extrabold tracking-wider text-white uppercase">
              <Sparkles className="size-4" aria-hidden="true" />
              Guía de compra
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-brand-ink sm:text-6xl">
              Encuentra tu <span className="text-brand-red">placer ideal</span>
            </h2>
            <p className="mt-4 text-xl text-neutral-700">
              Selecciones pensadas para cada persona y cada momento. Elige y
              déjate llevar.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide) => {
              const category = bySlug.get(guide.slug);
              return (
                <Link
                  key={guide.slug}
                  href={`/tienda?categoria=${guide.slug}`}
                  className={cn(
                    "group relative flex min-h-[480px] flex-col justify-end overflow-hidden rounded-3xl border-4 bg-white text-white transition-transform duration-300 hover:-translate-y-2",
                    guide.border,
                    guide.shadow
                  )}
                >
                  {category?.image && (
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  )}
                  <div className={cn("absolute inset-0 bg-gradient-to-t to-transparent", guide.overlay)} />

                  <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-sm font-extrabold tracking-wide text-brand-ink uppercase shadow-md">
                    {guide.badge}
                  </span>

                  <div className="relative p-6">
                    <p className="text-4xl font-black tracking-tight drop-shadow">{guide.title}</p>
                    <p className="mt-2 text-lg leading-snug font-medium text-white">{guide.text}</p>
                    {category && (
                      <p className="mt-3 text-base font-bold text-white/85">
                        +{category.count.toLocaleString("es-ES")} productos
                      </p>
                    )}
                    <span className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-lg font-extrabold text-brand-ink transition-colors group-hover:bg-brand-ink group-hover:text-white">
                      Descubrir
                      <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
