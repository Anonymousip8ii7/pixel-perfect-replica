import { useMemo, useState } from "react";
import type { ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, filters = false }: { products: ShopifyProduct[]; filters?: boolean }) {
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.node.productType).filter(Boolean))),
    [products],
  );
  const [cat, setCat] = useState<string>("All");
  const shown = cat === "All" ? products : products.filter((p) => p.node.productType === cat);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed py-24 text-center">
        <p className="font-display text-3xl italic">No products found</p>
        <p className="mt-2 text-sm text-muted-foreground">New pieces are on their way.</p>
      </div>
    );
  }

  return (
    <div>
      {filters && categories.length > 0 && (
        <div role="group" aria-label="Filter by category" className="mb-10 flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`eyebrow rounded-full border px-5 py-2.5 transition-colors ${
                cat === c ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-4">
        {shown.map((p) => (
          <ProductCard key={p.node.id} product={p} />
        ))}
      </div>
    </div>
  );
}
