"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import type { WooProduct } from "@/lib/types";
import { toast } from "sonner";

export function ProductCard({ product }: { product: WooProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const image = product.images[0]?.src ?? "/placeholder-product.svg";
  const outOfStock = product.stock_status === "outofstock";

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image,
      stockQuantity: product.stock_quantity,
    });
    toast.success(`${product.name} añadido al carrito`);
  }

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-neutral-200/70 bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.09)]">
      <Link
        href={`/producto/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-xl bg-neutral-50"
      >
        <Image
          src={image}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {product.on_sale && (
          <span className="absolute top-3 left-3 rounded-full bg-brand-red px-3 py-1 text-sm font-bold text-white">
            Oferta
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-3 right-3 rounded-full bg-brand-ink px-3 py-1 text-sm font-bold text-white">
            Agotado
          </span>
        )}

        <button
          type="button"
          disabled={outOfStock}
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-brand-red py-3 text-lg font-bold text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-brand-red-dark disabled:pointer-events-none disabled:opacity-0 sm:block hidden"
        >
          Añadir al carrito
        </button>
      </Link>

      <div className="mt-4 flex-1 px-1">
        <Link href={`/producto/${product.slug}`}>
          <h3 className="line-clamp-2 text-lg leading-snug font-semibold text-brand-ink hover:text-brand-red">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-brand-red">{formatPrice(product.price)}</span>
          {product.on_sale && (
            <span className="text-lg text-neutral-500 line-through">
              {formatPrice(product.regular_price)}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={outOfStock}
        onClick={handleAddToCart}
        className="mt-3 w-full rounded-full bg-brand-red py-3 text-lg font-bold text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
      >
        {outOfStock ? "Agotado" : "Añadir al carrito"}
      </button>
    </div>
  );
}
