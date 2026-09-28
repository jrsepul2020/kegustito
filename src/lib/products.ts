import { unstable_cache } from "next/cache";
import { wooClient } from "@/lib/woocommerce";
import { getCategoryBySlug } from "@/lib/categories";
import type { WooProduct } from "@/lib/types";

export interface GetProductsParams {
  page?: number;
  perPage?: number;
  category?: string;
  search?: string;
  orderby?: "date" | "price" | "popularity" | "rating" | "title";
  order?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  inStock?: boolean;
  exclude?: number[];
}


// Every WooCommerce call is cached: the backend is slow and cannot absorb a
// request per page render (dev tooling alone polls the page every few seconds).
const PRODUCT_TTL = 300;

// Listings only need what ProductCard renders; full payloads are ~10x larger.
const LIST_FIELDS =
  "id,name,slug,price,regular_price,sale_price,on_sale,stock_status,stock_quantity,images,categories";

function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

type ProductList = { products: WooProduct[]; totalPages: number; total: number };

const fetchProductList = unstable_cache(
  async (
    params: Omit<GetProductsParams, "category"> & { categoryId?: number }
  ): Promise<ProductList> => {
    const {
      page = 1,
      perPage = 12,
      categoryId,
      search,
      orderby,
      order,
      minPrice,
      maxPrice,
      onSale,
      inStock,
      exclude,
    } = params;

    const response = await wooClient.get(
      "products",
      omitUndefined({
        page,
        per_page: perPage,
        category: categoryId,
        search,
        orderby,
        order,
        min_price: minPrice,
        max_price: maxPrice,
        on_sale: onSale || undefined,
        stock_status: inStock ? "instock" : undefined,
        exclude: exclude?.length ? exclude.join(",") : undefined,
        status: "publish",
        _fields: LIST_FIELDS,
      })
    );

    const totalPages = Number(response.headers["x-wp-totalpages"] ?? 1);
    const total = Number(response.headers["x-wp-total"] ?? 0);

    return { products: response.data as WooProduct[], totalPages, total };
  },
  ["woo-products-v2"],
  { revalidate: PRODUCT_TTL }
);

// Not cached itself: a cache nested inside another cache's miss is not reused by
// Next, which made every new listing re-download the whole category tree.
export async function getProducts(params: GetProductsParams = {}): Promise<ProductList> {
  const { category, ...rest } = params;
  if (!category) return fetchProductList(rest);

  const categoryId = (await getCategoryBySlug(category))?.id;
  if (!categoryId) return { products: [], totalPages: 0, total: 0 };
  return fetchProductList({ ...rest, categoryId });
}

export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<WooProduct | null> => {
    const response = await wooClient.get("products", { slug });
    const products = response.data as WooProduct[];
    return products[0] ?? null;
  },
  ["woo-product-by-slug"],
  { revalidate: PRODUCT_TTL }
);

export const getOnSaleProducts = unstable_cache(
  async (perPage = 4): Promise<WooProduct[]> => {
    const response = await wooClient.get("products", {
      on_sale: true,
      stock_status: "instock",
      per_page: perPage,
      status: "publish",
      _fields: LIST_FIELDS,
    });
    return response.data as WooProduct[];
  },
  ["woo-on-sale-products"],
  { revalidate: PRODUCT_TTL }
);

export const getFeaturedProducts = unstable_cache(
  async (perPage = 8): Promise<WooProduct[]> => {
    const response = await wooClient.get("products", {
      featured: true,
      per_page: perPage,
      status: "publish",
      _fields: LIST_FIELDS,
    });
    return response.data as WooProduct[];
  },
  ["woo-featured-products"],
  { revalidate: PRODUCT_TTL }
);
