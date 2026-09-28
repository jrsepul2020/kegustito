import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Lock, Package, Truck } from "lucide-react";
import { getFeaturedProducts, getProductBySlug, getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { ProductCard } from "@/components/product-card";
import type { WooProduct } from "@/lib/types";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getHighlightedProducts(product: WooProduct): Promise<WooProduct[]> {
  const featured = (await getFeaturedProducts(9).catch(() => [])).filter(
    (p) => p.id !== product.id
  );
  if (featured.length >= 4) return featured.slice(0, 4);

  // Few or no products are marked as featured in WooCommerce: fill with the same category.
  const categorySlug = product.categories[0]?.slug;
  const sameCategory = categorySlug
    ? await getProducts({
        category: categorySlug,
        perPage: 8,
        inStock: true,
        exclude: [product.id, ...featured.map((p) => p.id)],
      })
        .then((r) => r.products)
        .catch(() => [])
    : [];
  return [...featured, ...sameCategory].slice(0, 4);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const image = product.images[0]?.src ?? "/placeholder-product.svg";
  const highlighted = await getHighlightedProducts(product);
  const inStock = product.stock_status === "instock";

  return (
    <div>
      <div className="mx-auto max-w-[1600px] px-4 py-10 lg:px-8">
        <nav aria-label="Migas de pan" className="mb-8 flex flex-wrap items-center gap-2 text-lg text-neutral-600">
          <Link href="/" className="hover:text-brand-red">Inicio</Link>
          <ChevronRight className="size-4" aria-hidden="true" />
          <Link href="/tienda" className="hover:text-brand-red">Tienda</Link>
          {product.categories[0] && (
            <>
              <ChevronRight className="size-4" aria-hidden="true" />
              <Link
                href={`/tienda?categoria=${product.categories[0].slug}`}
                className="hover:text-brand-red"
              >
                {product.categories[0].name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-neutral-100">
            <Image
              src={image}
              alt={product.images[0]?.alt || product.name}
              fill
              className="object-contain p-6 mix-blend-multiply"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.on_sale && (
              <span className="absolute top-5 left-5 rounded-full bg-brand-red px-4 py-1.5 text-base font-bold text-white">
                Oferta
              </span>
            )}
          </div>

          <div>
            <h1 className="text-3xl leading-tight font-black tracking-tight text-brand-ink sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-4xl font-black text-brand-red">
                {formatPrice(product.price)}
              </span>
              {product.on_sale && (
                <span className="text-2xl text-neutral-500 line-through">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>

            <p className={`mt-3 text-lg font-bold ${inStock ? "text-green-700" : "text-brand-red"}`}>
              {inStock ? "● En stock" : "● Agotado"}
            </p>

            {product.short_description && (
              <div
                className="prose prose-lg mt-6 max-w-none text-neutral-700"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            <div className="mt-8">
              <AddToCartForm product={product} />
            </div>

            <ul className="mt-8 grid gap-3 rounded-2xl bg-neutral-100 p-5 sm:grid-cols-3">
              {[
                { icon: Package, text: "Embalaje discreto" },
                { icon: Truck, text: "Envío rápido" },
                { icon: Lock, text: "Pago seguro" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-lg font-semibold text-brand-ink">
                  <Icon className="size-5 shrink-0 text-brand-red" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/tienda?categoria=${c.slug}`}
                  className="rounded-full border-2 border-neutral-200 px-4 py-1.5 text-base font-semibold text-brand-ink hover:border-brand-red hover:text-brand-red"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {product.description && (
          <section className="mt-16 border-t pt-12">
            <h2 className="text-3xl font-black text-brand-ink">Descripción</h2>
            <div
              className="prose prose-lg mt-6 max-w-4xl text-neutral-700"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </section>
        )}
      </div>

      {highlighted.length > 0 && (
        <section className="mt-10 bg-neutral-100 py-20">
          <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
            <h2 className="mb-10 text-3xl font-black tracking-tight text-brand-ink sm:text-5xl">
              Productos <span className="text-brand-red">destacados</span>
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {highlighted.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
