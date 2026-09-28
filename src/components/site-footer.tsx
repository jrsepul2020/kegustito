import Image from "next/image";
import Link from "next/link";
import {
  Cookie,
  Heart,
  Lock,
  Mail,
  RotateCcw,
  Scale,
  ShieldCheck,
  Tag,
  Truck,
  User,
  type LucideIcon,
} from "lucide-react";
import { getTopLevelCategories } from "@/lib/categories";

const wp = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";

interface FooterLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const helpLinks: FooterLink[] = [
  { label: "Contacto", href: `${wp}/contact/`, icon: Mail },
  { label: "Envíos y devoluciones", href: `${wp}/refund_returns/`, icon: Truck },
  { label: "Mi cuenta", href: `${wp}/my-account/`, icon: User },
  { label: "Sobre nosotras", href: `${wp}/about/`, icon: Heart },
];

const legalLinks: FooterLink[] = [
  { label: "Aviso legal", href: `${wp}/aviso-legal/`, icon: Scale },
  { label: "Política de privacidad", href: `${wp}/privacy-policy/`, icon: ShieldCheck },
  { label: "Política de cookies", href: `${wp}/privacy-policy/`, icon: Cookie },
  { label: "Devoluciones y reembolsos", href: `${wp}/refund_returns/`, icon: RotateCcw },
];

const paymentMethods = ["VISA", "Mastercard", "PayPal", "Apple Pay", "Google Pay"];

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="lg:border-l lg:border-white/20 lg:pl-8">
      <h3 className="text-lg font-extrabold tracking-wider uppercase">{title}</h3>
      <div
        className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-white via-white/60 to-transparent"
        aria-hidden="true"
      />
      <ul className="mt-5 space-y-2">
        {links.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="group flex items-center gap-3 py-0.5 text-lg text-white transition-colors hover:text-white/75"
            >
              <Icon
                className="size-5 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function SiteFooter() {
  const categories = await getTopLevelCategories(8).catch(() => []);

  return (
    <footer className="bg-brand-red text-white">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 lg:px-8 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Image
            src="/logo-white.png"
            alt="Kegustito Erotic Shop"
            width={600}
            height={301}
            className="h-20 w-auto"
          />
          <p className="mt-5 max-w-xs text-lg leading-relaxed text-white">
            Tu tienda erótica online de confianza. Productos seleccionados y
            envío 100% discreto.
          </p>
        </div>

        <FooterColumn
          title="Categorías"
          links={categories.slice(0, 6).map((c) => ({
            label: c.name,
            href: `/tienda?categoria=${c.slug}`,
            icon: Tag,
          }))}
        />
        <FooterColumn title="Ayuda" links={helpLinks} />
        <FooterColumn title="Legal" links={legalLinks} />
      </div>

      <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
        <hr className="border-white/30" />
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-6 px-4 lg:px-8 py-8 md:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="mr-2 flex items-center gap-2 text-base font-bold tracking-wider uppercase">
            <Lock className="size-5" aria-hidden="true" />
            Pago seguro
          </span>
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="rounded-md bg-white px-3 py-1.5 text-sm font-extrabold text-brand-ink"
            >
              {method}
            </span>
          ))}
        </div>
        <p className="text-base text-white">
          © {new Date().getFullYear()} Kegustito Erotic Shop
        </p>
      </div>
    </footer>
  );
}
