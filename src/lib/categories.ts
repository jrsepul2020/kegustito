import { unstable_cache } from "next/cache";
import { wooClient } from "@/lib/woocommerce";

export interface CategoryNode {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent: number;
  image?: string | null;
}

interface RawCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  image: { src: string } | null;
}

interface RawProduct {
  images: { src: string }[];
  categories: { id: number }[];
}

const CATEGORY_TTL = 3600;

// Every WordPress request costs 1.5–3 s of bootstrap, so the whole (small) tree is
// fetched once with only the fields we use; all lookups below are then in-memory.
export const getAllCategories = unstable_cache(
  async (): Promise<CategoryNode[]> => {
    const fetchPage = (page: number) =>
      wooClient.get("products/categories", {
        per_page: 100,
        page,
        hide_empty: true,
        _fields: "id,name,slug,parent,count,image",
      });

    const first = await fetchPage(1);
    const totalPages = Number(first.headers["x-wp-totalpages"] ?? 1);
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2))
    );

    return [first, ...rest]
      .flatMap((r) => r.data as RawCategory[])
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        parent: c.parent,
        count: c.count,
        image: c.image?.src ?? null,
      }));
  },
  ["woo-all-categories-v1"],
  { revalidate: CATEGORY_TTL }
);

const byCountDesc = (a: CategoryNode, b: CategoryNode) => b.count - a.count;

export async function getCategoryBySlug(slug: string) {
  const all = await getAllCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getTopLevelCategories(limit: number) {
  const all = await getAllCategories();
  return all.filter((c) => c.parent === 0).sort(byCountDesc).slice(0, limit);
}

export async function getChildCategories(parentId: number, limit: number) {
  const all = await getAllCategories();
  return all.filter((c) => c.parent === parentId).sort(byCountDesc).slice(0, limit);
}

// One product request covers every category, instead of one request per category.
// Receives the categories as data so this cache never nests the category-tree cache.
const resolveCategoryImages = unstable_cache(
  async (categories: CategoryNode[]): Promise<CategoryNode[]> => {
    if (categories.every((c) => c.image)) return categories;

    const response = await wooClient.get("products", {
      per_page: 50,
      status: "publish",
      _fields: "images,categories",
    });
    const products = response.data as RawProduct[];
    const used = new Set<string>();

    const result: CategoryNode[] = [];
    for (const category of categories) {
      if (category.image) {
        result.push(category);
        continue;
      }
      const match = products.find(
        (p) =>
          p.images[0]?.src &&
          !used.has(p.images[0].src) &&
          p.categories.some((c) => c.id === category.id)
      );
      let image = match?.images[0].src ?? null;
      // Only categories absent from the shared sample cost an extra request.
      if (!image) {
        const own = await wooClient.get("products", {
          category: category.id,
          per_page: 1,
          status: "publish",
          _fields: "images",
        });
        image = (own.data as RawProduct[])[0]?.images[0]?.src ?? null;
      }
      if (image) used.add(image);
      result.push({ ...category, image });
    }
    return result;
  },
  ["woo-category-images-v1"],
  { revalidate: CATEGORY_TTL }
);

export async function getTopLevelCategoriesWithImages(limit: number) {
  return resolveCategoryImages(await getTopLevelCategories(limit));
}
