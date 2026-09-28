"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { WooProduct } from "@/lib/types";
import { toast } from "sonner";

export function AddToCartForm({ product }: { product: WooProduct }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const outOfStock = product.stock_status === "outofstock";
  const image = product.images[0]?.src ?? "/placeholder-product.svg";

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image,
        stockQuantity: product.stock_quantity,
      },
      quantity
    );
    toast.success(`${product.name} añadido al carrito`);
  }

  if (outOfStock) {
    return (
      <button
        type="button"
        disabled
        className="h-14 w-full cursor-not-allowed rounded-full bg-neutral-300 px-10 text-lg font-bold text-neutral-600 sm:w-auto"
      >
        Agotado
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex h-14 items-center rounded-full border-2 border-neutral-200">
        <button
          type="button"
          aria-label="Quitar uno"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex size-14 items-center justify-center rounded-full text-brand-ink hover:text-brand-red"
        >
          <Minus className="size-5" />
        </button>
        <span className="w-10 text-center text-xl font-bold" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Añadir uno"
          onClick={() => setQuantity((q) => q + 1)}
          className="flex size-14 items-center justify-center rounded-full text-brand-ink hover:text-brand-red"
        >
          <Plus className="size-5" />
        </button>
      </div>
      <button
        type="button"
        onClick={handleAddToCart}
        className="h-14 flex-1 rounded-full bg-brand-red px-10 text-lg font-bold text-white transition-colors hover:bg-brand-red-dark sm:flex-none"
      >
        Añadir al carrito
      </button>
    </div>
  );
}
