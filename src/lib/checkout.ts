import { useCartStore } from "@/lib/cart-store";

function base64UrlEncode(json: string): string {
  const base64 =
    typeof window === "undefined"
      ? Buffer.from(json, "utf-8").toString("base64")
      : btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function buildCheckoutUrl(target: "checkout" | "cart" = "checkout") {
  const items = useCartStore.getState().items.map((item) => ({
    id: item.productId,
    qty: item.quantity,
  }));

  const checkoutUrl = process.env.NEXT_PUBLIC_WORDPRESS_CHECKOUT_URL;
  const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const baseUrl = (checkoutUrl ?? wordpressUrl ?? "https://kegustito.com")
    .replace(/\/checkout\/?$/, "")
    .replace(/\/$/, "");

  const encoded = base64UrlEncode(JSON.stringify(items));
  const redirectParam = target === "cart" ? "&redirect_to=cart" : "";

  return `${baseUrl}/?kg_sync_cart=${encoded}${redirectParam}`;
}
