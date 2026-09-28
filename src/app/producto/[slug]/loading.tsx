function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-neutral-200 ${className}`} />;
}

export default function ProductLoading() {
  return (
    <div
      className="mx-auto max-w-[1600px] px-4 py-10 lg:px-8"
      aria-busy="true"
      aria-label="Cargando producto"
    >
      <Block className="mb-8 h-5 w-72" />
      <div className="grid gap-12 lg:grid-cols-2">
        <Block className="aspect-square w-full rounded-3xl" />
        <div>
          <Block className="h-10 w-4/5" />
          <Block className="mt-5 h-12 w-40" />
          <Block className="mt-6 h-24 w-full" />
          <Block className="mt-8 h-14 w-72 rounded-full" />
        </div>
      </div>
    </div>
  );
}
