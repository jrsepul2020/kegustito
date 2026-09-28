"use client";

import { useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { CategoryNode } from "@/lib/categories";

const childrenCache = new Map<number, CategoryNode[]>();

function CategorySubmenu({ category }: { category: CategoryNode }) {
  const [children, setChildren] = useState<CategoryNode[] | null>(
    childrenCache.get(category.id) ?? null
  );
  const [loading, setLoading] = useState(false);

  async function handleOpen() {
    if (childrenCache.has(category.id) || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/children?parent=${category.id}`);
      const data = await res.json();
      childrenCache.set(category.id, data.children ?? []);
      setChildren(data.children ?? []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <NavigationMenuItem onMouseEnter={handleOpen} onFocus={handleOpen}>
      <NavigationMenuTrigger className="rounded-none bg-transparent shrink-0 px-3 py-3 text-lg font-extrabold tracking-wide text-brand-ink uppercase hover:bg-transparent hover:text-brand-red focus:bg-transparent data-open:bg-transparent data-open:text-brand-red data-popup-open:bg-transparent data-popup-open:text-brand-red">
        {category.name}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[520px] grid-cols-2 gap-x-6 gap-y-1 p-4">
          {children === null ? (
            <p className="col-span-2 py-2 text-lg text-neutral-600">
              Cargando...
            </p>
          ) : children.length === 0 ? (
            <p className="col-span-2 py-2 text-lg text-neutral-600">
              Sin subcategorías
            </p>
          ) : (
            children.map((child) => (
              <NavigationMenuLink
                key={child.id}
                className="text-lg font-medium text-brand-ink hover:text-brand-red"
                render={<Link href={`/tienda?categoria=${child.slug}`} />}
              >
                {child.name}
                <span className="ml-auto text-sm font-semibold text-neutral-500">
                  {child.count}
                </span>
              </NavigationMenuLink>
            ))
          )}
        </div>
        <div className="border-t p-2">
          <NavigationMenuLink
            render={
              <Link
                href={`/tienda?categoria=${category.slug}`}
                className="justify-center text-lg font-bold text-brand-red"
              />
            }
          >
            Ver todo en {category.name}
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

export function MainNav({ categories }: { categories: CategoryNode[] }) {
  return (
    <NavigationMenu className="w-full max-w-none justify-start">
      <NavigationMenuList className="flex-nowrap justify-start gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <CategorySubmenu key={category.id} category={category} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
