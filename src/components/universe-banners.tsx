import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const universes = [
  {
    title: "Ellas",
    subtitle: "Para ella",
    image: "/imagenes/ellas.jpg",
    href: "/tienda?categoria=women",
  },
  {
    title: "Ellos",
    subtitle: "Para él",
    image: "/imagenes/ellos.jpg",
    href: "/tienda?categoria=men",
  },
  {
    title: "Dos mujeres",
    subtitle: "Para ellas",
    image: "/imagenes/dos-mujeres.jpg",
    href: undefined,
  },
  {
    title: "Dos hombres",
    subtitle: "Para ellos",
    image: "/imagenes/dos-hombres.jpg",
    href: undefined,
  },
] as const;

function UniverseBanner({
  title,
  subtitle,
  image,
  href,
}: (typeof universes)[number]) {
  const content = (
    <>
      <Image
        src={image}
        alt=""
        fill
        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
        priority
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center px-4 pb-8 pt-16 text-center text-white">
        <h3 className="text-3xl font-black uppercase tracking-[0.12em] drop-shadow-md sm:text-4xl">
          {title}
        </h3>
        <p className="mt-2 text-base font-medium text-white/90 sm:text-lg">{subtitle}</p>
        <span className="mt-6 inline-flex min-h-11 items-center border border-[#c9a962] bg-transparent px-8 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors group-hover:bg-[#c9a962]/15">
          Ver colección
        </span>
      </div>
    </>
  );

  const className = cn(
    "group relative flex min-h-[420px] flex-1 flex-col justify-end overflow-hidden rounded-sm",
    "border border-[#c9a962]/70 bg-brand-ink shadow-[inset_0_0_0_1px_rgba(201,169,98,0.15)]",
    "sm:min-h-[480px] lg:min-h-[560px]",
    href && "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a962]"
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={`${title}: ver colección`}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}

export function UniverseBanners() {
  return (
    <section className="bg-[#0a0a0a] py-16 sm:py-20">
      <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
        <header className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Elige tu universo
          </h2>
          <p className="mt-3 text-lg text-white/65 sm:text-xl">
            Cuatro entradas. Un clic. La colección que buscas.
          </p>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 lg:gap-3">
          {universes.map((item) => (
            <UniverseBanner key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
