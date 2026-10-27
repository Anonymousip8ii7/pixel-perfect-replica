import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { productQueryOptions } from "@/lib/shopify";
import { AddToCart } from "@/components/AddToCart";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productQueryOptions(params.handle));
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Unavailable — Maison Oat" }, { name: "robots", content: "noindex" }] };
    const n = loaderData.node;
    const desc = n.description.slice(0, 155) || `${n.title} from Maison Oat.`;
    const img = n.images.edges[0]?.node.url;
    return {
      meta: [
        { title: `${n.title} — Maison Oat` },
        { name: "description", content: desc },
        { property: "og:title", content: `${n.title} — Maison Oat` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-xl px-5 py-32 text-center">
      <h1 className="text-5xl">Piece not found</h1>
      <Link to="/shop" className="eyebrow mt-6 inline-block underline underline-offset-4">Back to shop</Link>
    </main>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data } = useSuspenseQuery(productQueryOptions(handle));
  const [idx, setIdx] = useState(0);
  if (!data) return null;
  const n = data.node;
  const images = n.images.edges.map((e) => e.node);
  const main = images[idx];

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:grid-cols-2 md:gap-16 md:px-8 md:py-16">
      <div>
        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
          {main && <img src={main.url} alt={main.altText ?? n.title} className="h-full w-full object-cover" />}
        </div>
        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {images.map((im, i) => (
              <button key={im.url} aria-label={`View image ${i + 1}`} onClick={() => setIdx(i)} className={`aspect-square overflow-hidden rounded-md border-2 ${i === idx ? "border-primary" : "border-transparent"}`}>
                <img src={im.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="md:sticky md:top-24 md:self-start">
        <nav aria-label="Breadcrumb" className="eyebrow text-muted-foreground">
          <Link to="/shop" className="hover:underline">Shop</Link> / {n.productType || "Piece"}
        </nav>
        <h1 className="mt-4 text-5xl leading-tight md:text-6xl">{n.title}</h1>
        <div className="mt-6">
          <AddToCart product={data} />
        </div>
        {n.description && (
          <div className="mt-10 border-t pt-6">
            <h2 className="eyebrow mb-3 text-muted-foreground">Details</h2>
            <p className="leading-relaxed">{n.description}</p>
          </div>
        )}
      </div>
    </main>
  );
}
