import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { type ShopifyProduct, formatPrice } from "@/lib/shopify";
import { AddToCart } from "./AddToCart";

const COLOR_HINTS: Record<string, string> = {};

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const { node } = product;
  const img = node.images.edges[0]?.node;
  const img2 = node.images.edges[1]?.node;
  const colors = node.options.find((o) => /colou?r/i.test(o.name))?.values ?? [];
  const price = node.priceRange.minVariantPrice;
  void COLOR_HINTS;

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
        <Link to="/product/$handle" params={{ handle: node.handle }} aria-label={node.title}>
          {img ? (
            <>
              <img src={img.url} alt={img.altText ?? node.title} loading="lazy" className="img-zoom h-full w-full object-cover group-hover:scale-105" />
              {img2 && (
                <img src={img2.url} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              )}
            </>
          ) : (
            <div className="grid h-full place-items-center font-display italic text-muted-foreground">No image</div>
          )}
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <button className="eyebrow absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-background/90 py-3 opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100 max-md:translate-y-0 max-md:opacity-100">
              Quick view
            </button>
          </DialogTrigger>
          <DialogContent className="grid max-w-3xl gap-6 bg-background p-0 sm:grid-cols-2 overflow-hidden">
            <div className="aspect-[3/4] bg-muted">
              {img && <img src={img.url} alt={img.altText ?? node.title} className="h-full w-full object-cover" />}
            </div>
            <div className="space-y-4 p-6 sm:pl-0">
              <DialogTitle className="font-display text-3xl font-normal">{node.title}</DialogTitle>
              <DialogDescription className="line-clamp-4">{node.description}</DialogDescription>
              <AddToCart product={product} />
              <Link to="/product/$handle" params={{ handle: node.handle }} className="eyebrow block underline underline-offset-4">
                View full details
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link to="/product/$handle" params={{ handle: node.handle }}>
            <h3 className="font-display text-xl leading-tight">{node.title}</h3>
          </Link>
          {colors.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {colors.length} colour{colors.length > 1 ? "s" : ""} · {colors.slice(0, 3).join(", ")}
            </p>
          )}
        </div>
        <span className="text-sm">{formatPrice(price.amount, price.currencyCode)}</span>
      </div>
    </article>
  );
}
