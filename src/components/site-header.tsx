import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { CartSheet } from "@/components/cart-sheet";
import { SearchForm } from "@/components/search-form";
import { MainNav } from "@/components/main-nav";
import { getTopLevelCategories } from "@/lib/categories";

export async function SiteHeader() {
  const categories = await getTopLevelCategories(8).catch(() => []);

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="bg-brand-red px-4 py-2 text-center text-base font-semibold text-white sm:text-lg">
        Envío 100% discreto · Pago seguro<span className="hidden sm:inline"> · Pedidos antes de las 15h se envían hoy</span>
      </div>

      <div className="border-b">
        <div className="mx-auto flex max-w-[1600px] items-center gap-6 px-4 lg:px-8 py-3">
          <Link href="/" className="shrink-0" aria-label="Kegustito, inicio">
            <Image
              src="/logo.png"
              alt="Kegustito Erotic Shop"
              width={609}
              height={309}
              priority
              className="h-14 w-auto sm:h-[72px]"
            />
          </Link>

          <div className="hidden flex-1 justify-center sm:flex">
            <SearchForm className="w-full max-w-2xl" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/mi-cuenta"
              className="flex h-10 items-center gap-2 rounded-md px-2 text-lg font-semibold text-brand-ink transition-colors hover:text-brand-red"
            >
              <User className="size-5" />
              <span className="hidden md:inline">Acceder</span>
            </Link>
            <CartSheet />
          </div>
        </div>

        <div className="px-4 pb-3 sm:hidden">
          <SearchForm className="w-full" />
        </div>
      </div>

      <div className="border-b">
        <div className="mx-auto max-w-[1600px] px-2 lg:px-6">
          {categories.length > 0 ? (
            <MainNav categories={categories} />
          ) : (
            <nav className="flex gap-4 px-2 py-3 text-lg font-bold uppercase">
              <Link href="/tienda" className="hover:text-brand-red">
                Tienda
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
