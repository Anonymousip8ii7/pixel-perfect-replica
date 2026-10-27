import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

/** Option pickers (size, color…) + add to bag, shared by quick view and product page. */
export function AddToCart({ product }: { product: ShopifyProduct }) {
  const { node } = product;
  const variants = node.variants.edges.map((e) => e.node);
  const realOptions = node.options.filter((o) => !(o.values.length === 1 && o.values[0] === "Default Title"));
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries((variants[0]?.selectedOptions ?? []).map((o) => [o.name, o.value])),
  );
  const variant = useMemo(
    () => variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ?? variants[0],
    [variants, selected],
  );
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const isLoading = useCartStore((s) => s.isLoading);

  const add = async () => {
    if (!variant) return;
    const ok = await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });
    if (ok) {
      toast.success("Added to your bag", { description: node.title, position: "top-center" });
      setOpen(true);
    } else toast.error("Couldn't add to bag", { position: "top-center" });
  };

  return (
    <div className="space-y-6">
      {variant && <p className="font-display text-2xl">{formatPrice(variant.price.amount, variant.price.currencyCode)}</p>}
      {realOptions.map((opt) => (
        <fieldset key={opt.name}>
          <legend className="eyebrow mb-3 text-muted-foreground">
            {opt.name}: <span className="text-foreground">{selected[opt.name]}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((val) => {
              const active = selected[opt.name] === val;
              return (
                <button
                  key={val}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected((s) => ({ ...s, [opt.name]: val }))}
                  className={`min-w-12 rounded-full border px-4 py-2 text-sm transition-colors ${
                    active ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      <Button
        size="lg"
        className="w-full rounded-full"
        onClick={add}
        disabled={isLoading || !variant || !variant.availableForSale}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : variant?.availableForSale === false ? "Sold out" : "Add to bag"}
      </Button>
    </div>
  );
}
