function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-neutral-200 ${className}`} />;
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4 lg:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-neutral-200/70 bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
        >
          <Block className="aspect-square w-full" />
          <Block className="mt-4 h-5 w-4/5" />
          <Block className="mt-2 h-6 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div
      className="mx-auto max-w-[1600px] px-4 py-10 lg:px-8"
      aria-busy="true"
      aria-label="Cargando productos"
    >
      <Block className="h-5 w-56" />
      <Block className="mt-4 h-12 w-72" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[300px_1fr]">
        <div className="hidden space-y-3 lg:block">
          <Block className="h-7 w-40" />
          {Array.from({ length: 10 }, (_, i) => (
            <Block key={i} className="h-10 w-full" />
          ))}
        </div>
        <div>
          <Block className="mb-8 h-16 w-full rounded-2xl" />
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}
